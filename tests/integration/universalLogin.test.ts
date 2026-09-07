import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";
import { hashPassword } from "@/lib/auth/password";
import { authenticateAny } from "@/lib/services/authService";
import {
  createAdminSession,
  createCustomerSession,
  createTeamSession,
  ADMIN_SESSION_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  TEAM_SESSION_COOKIE,
} from "@/lib/auth/session";
import { __resetCookieStore } from "../stubs/next-headers";
import { cookies } from "next/headers";

beforeEach(async () => {
  await resetDatabase();
  __resetCookieStore();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("authenticateAny — the universal /login backend", () => {
  it("authenticates an admin by email + password alone, no role selection", async () => {
    await prisma.adminUser.create({
      data: { name: "Admin", email: "admin@example.com", passwordHash: await hashPassword("adminpass1"), isActive: true },
    });

    const account = await authenticateAny("admin@example.com", "adminpass1");
    expect(account).toEqual({ role: "admin", id: expect.any(String), email: "admin@example.com", name: "Admin" });
  });

  it("authenticates an active team member", async () => {
    const member = await prisma.teamMember.create({
      data: {
        name: "Team Member",
        email: "team@example.com",
        passwordHash: await hashPassword("teampass1"),
        accountStatus: "ACTIVE",
        isActive: true,
      },
    });

    const account = await authenticateAny("team@example.com", "teampass1");
    expect(account).toEqual({ role: "team", id: member.id, email: "team@example.com", name: "Team Member" });
  });

  it("authenticates an active customer", async () => {
    const customer = await prisma.customer.create({
      data: {
        email: "customer@example.com",
        passwordHash: await hashPassword("custpass1"),
        phoneCountry: "BH",
        phoneE164: "+97336001234",
        accountStatus: "ACTIVE",
      },
    });

    const account = await authenticateAny("customer@example.com", "custpass1");
    expect(account).toEqual({ role: "customer", id: customer.id, email: "customer@example.com" });
  });

  it("rejects a wrong password with no distinction from a nonexistent account", async () => {
    await prisma.adminUser.create({
      data: { name: "Admin", email: "admin2@example.com", passwordHash: await hashPassword("adminpass1"), isActive: true },
    });

    const wrongPassword = await authenticateAny("admin2@example.com", "wrongpassword");
    const noSuchAccount = await authenticateAny("nobody@example.com", "whatever12");
    expect(wrongPassword).toBeNull();
    expect(noSuchAccount).toBeNull();
  });

  it("rejects a deactivated admin account", async () => {
    await prisma.adminUser.create({
      data: { name: "Admin", email: "inactive-admin@example.com", passwordHash: await hashPassword("adminpass1"), isActive: false },
    });

    const account = await authenticateAny("inactive-admin@example.com", "adminpass1");
    expect(account).toBeNull();
  });

  it("rejects a deactivated team member and an unaccepted invitation", async () => {
    await prisma.teamMember.create({
      data: {
        name: "Deactivated",
        email: "deactivated-team@example.com",
        passwordHash: await hashPassword("teampass1"),
        accountStatus: "ACTIVE",
        isActive: false,
      },
    });
    await prisma.teamMember.create({
      data: { name: "Invited Only", email: "invited-only@example.com" },
    });

    expect(await authenticateAny("deactivated-team@example.com", "teampass1")).toBeNull();
    expect(await authenticateAny("invited-only@example.com", "anypassword1")).toBeNull();
  });

  it("rejects an invited (not yet activated) customer", async () => {
    await prisma.customer.create({
      data: {
        email: "invited-customer@example.com",
        phoneCountry: "BH",
        phoneE164: "+97336001234",
        accountStatus: "INVITED",
      },
    });

    const account = await authenticateAny("invited-customer@example.com", "anypassword1");
    expect(account).toBeNull();
  });

  it("resolves a legacy cross-role email collision deterministically (admin wins)", async () => {
    // Should never happen going forward (accountIdentityService blocks it at
    // creation), but existing data is never destroyed automatically — the
    // backend still has to pick one account deterministically.
    const email = "collision@example.com";
    await prisma.adminUser.create({
      data: { name: "Admin Wins", email, passwordHash: await hashPassword("adminpass1"), isActive: true },
    });
    await prisma.teamMember.create({
      data: { name: "Shadowed Team", email, passwordHash: await hashPassword("teampass1"), accountStatus: "ACTIVE", isActive: true },
    });

    const account = await authenticateAny(email, "adminpass1");
    expect(account?.role).toBe("admin");
  });
});

describe("session cookies — one per role, all cleared by logout", () => {
  it("creates independently-named cookies for each role", async () => {
    await createAdminSession({ role: "admin", adminId: "a1", email: "a@example.com", name: "A" });
    await createTeamSession({ role: "team", teamMemberId: "t1", email: "t@example.com", name: "T" });
    await createCustomerSession({ role: "customer", customerId: "c1", email: "c@example.com" });

    const store = await cookies();
    expect(store.get(ADMIN_SESSION_COOKIE)?.value).toBeTruthy();
    expect(store.get(TEAM_SESSION_COOKIE)?.value).toBeTruthy();
    expect(store.get(CUSTOMER_SESSION_COOKIE)?.value).toBeTruthy();
    expect(store.get(ADMIN_SESSION_COOKIE)?.value).not.toBe(store.get(TEAM_SESSION_COOKIE)?.value);
  });
});
