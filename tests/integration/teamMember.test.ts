import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";
import { hashToken, generateRawToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";

const mockSendEmail = vi.fn().mockResolvedValue("SENT");
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const {
  createTeamMember,
  setTeamMemberActive,
  sendTeamMemberInvitation,
  deleteTeamMember,
  authenticateTeamMember,
} = await import("@/lib/services/teamService");
const { consumeSetPasswordToken } = await import("@/lib/services/secureTokenService");

beforeEach(async () => {
  await resetDatabase();
  mockSendEmail.mockClear();
});

afterAll(async () => {
  await prisma.$disconnect();
});

function extractToken(html: string): string {
  const match = html.match(/token=([^"&]+)/);
  if (!match) throw new Error("No token found in email HTML.");
  return decodeURIComponent(match[1]);
}

async function createCustomerAndProject() {
  const customer = await prisma.customer.create({
    data: {
      email: `customer-${Date.now()}-${Math.random()}@example.com`,
      phoneCountry: "BH",
      phoneE164: "+97336001234",
      accountStatus: "ACTIVE",
    },
  });
  const project = await prisma.project.create({
    data: {
      customerId: customer.id,
      name: "Test project",
      description: "A project used in tests.",
      status: "DEVELOPMENT",
      progress: 10,
      phoneCountry: "BH",
      phoneE164: "+97312345678",
    },
  });
  return { customer, project };
}

describe("team member activate/deactivate", () => {
  it("toggles isActive without touching accountStatus", async () => {
    const member = await createTeamMember({ name: "Sam", email: "sam@example.com" });
    expect(member.isActive).toBe(true);

    const deactivated = await setTeamMemberActive(member.id, false);
    expect(deactivated.isActive).toBe(false);

    const reactivated = await setTeamMemberActive(member.id, true);
    expect(reactivated.isActive).toBe(true);
    expect(reactivated.accountStatus).toBe("INVITED");
  });
});

describe("team member resend invitation", () => {
  it("sends an invite email with a working token", async () => {
    const member = await createTeamMember({ name: "Lina", email: "lina@example.com" });

    const result = await sendTeamMemberInvitation(member.id);
    expect(result).toBe("SENT");
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail.mock.calls[0]![0].to).toBe("lina@example.com");

    const token = await prisma.secureToken.findFirstOrThrow({
      where: { teamMemberId: member.id, type: "TEAM_MEMBER_INVITE" },
    });
    expect(token.usedAt).toBeNull();

    const rawToken = mockSendEmail.mock.calls[0]![0].html.match(/token=([^"&]+)/)?.[1];
    expect(rawToken).toBeTruthy();
    expect(hashToken(decodeURIComponent(rawToken!))).toBe(token.tokenHash);

    const consumed = await consumeSetPasswordToken(decodeURIComponent(rawToken!), "newpassword123");
    expect(consumed.ok).toBe(true);

    const updated = await prisma.teamMember.findUniqueOrThrow({ where: { id: member.id } });
    expect(updated.accountStatus).toBe("ACTIVE");
    expect(updated.passwordHash).not.toBeNull();
  });

  it("invalidates the previous token when resent", async () => {
    const member = await createTeamMember({ name: "Omar", email: "omar@example.com" });

    await sendTeamMemberInvitation(member.id);
    const firstRaw = mockSendEmail.mock.calls[0]![0].html.match(/token=([^"&]+)/)?.[1];
    const firstToken = await prisma.secureToken.findFirstOrThrow({
      where: { teamMemberId: member.id, type: "TEAM_MEMBER_INVITE" },
    });

    await sendTeamMemberInvitation(member.id);
    const secondRaw = mockSendEmail.mock.calls[1]![0].html.match(/token=([^"&]+)/)?.[1];

    const firstAfterResend = await prisma.secureToken.findUniqueOrThrow({ where: { id: firstToken.id } });
    expect(firstAfterResend.usedAt).not.toBeNull();

    // The old link no longer works...
    const oldAttempt = await consumeSetPasswordToken(decodeURIComponent(firstRaw!), "somepassword1");
    expect(oldAttempt.ok).toBe(false);

    // ...but the new one does.
    const newAttempt = await consumeSetPasswordToken(decodeURIComponent(secondRaw!), "somepassword1");
    expect(newAttempt.ok).toBe(true);
  });

  it("refuses to resend once the member is already active", async () => {
    const member = await createTeamMember({ name: "Active Al", email: "active-al@example.com" });
    await prisma.teamMember.update({ where: { id: member.id }, data: { accountStatus: "ACTIVE" } });

    const result = await sendTeamMemberInvitation(member.id);
    expect(result).toBe("FAILED");
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});

describe("team member delete", () => {
  it("permanently removes an unassigned member and their tokens", async () => {
    const member = await createTeamMember({ name: "Unassigned", email: "unassigned@example.com" });
    await sendTeamMemberInvitation(member.id);

    await deleteTeamMember(member.id);

    const found = await prisma.teamMember.findUnique({ where: { id: member.id } });
    expect(found).toBeNull();

    const tokens = await prisma.secureToken.findMany({ where: { teamMemberId: member.id } });
    expect(tokens).toHaveLength(0);
  });

  it("permanently removes an assigned member and cascades ProjectMember without touching the project", async () => {
    const member = await createTeamMember({ name: "Assigned", email: "assigned@example.com" });
    const { project } = await createCustomerAndProject();
    await prisma.projectMember.create({ data: { projectId: project.id, teamMemberId: member.id } });

    await deleteTeamMember(member.id);

    const found = await prisma.teamMember.findUnique({ where: { id: member.id } });
    expect(found).toBeNull();

    const memberships = await prisma.projectMember.findMany({ where: { teamMemberId: member.id } });
    expect(memberships).toHaveLength(0);

    const stillThere = await prisma.project.findUnique({ where: { id: project.id } });
    expect(stillThere).not.toBeNull();
  });
});

describe("team invitation token edge cases", () => {
  it("rejects an expired token", async () => {
    const member = await createTeamMember({ name: "Expired", email: "expired@example.com" });
    const raw = generateRawToken();
    await prisma.secureToken.create({
      data: {
        teamMemberId: member.id,
        type: "TEAM_MEMBER_INVITE",
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() - 1000),
      },
    });

    const result = await consumeSetPasswordToken(raw, "somepassword1");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/expired/i);
  });

  it("rejects a token that has already been used", async () => {
    const member = await createTeamMember({ name: "Reused", email: "reused@example.com" });
    const raw = generateRawToken();
    await prisma.secureToken.create({
      data: {
        teamMemberId: member.id,
        type: "TEAM_MEMBER_INVITE",
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        usedAt: new Date(),
      },
    });

    const result = await consumeSetPasswordToken(raw, "somepassword1");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/already been used/i);
  });

  it("rejects a token value that was never issued", async () => {
    const result = await consumeSetPasswordToken("not-a-real-token-value", "somepassword1");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/invalid/i);
  });

  it("never stores the raw token — only its hash", async () => {
    const member = await createTeamMember({ name: "Hashed", email: "hashed@example.com" });
    await sendTeamMemberInvitation(member.id);
    const raw = mockSendEmail.mock.calls[0]![0].html.match(/token=([^"&]+)/)?.[1];
    const decoded = decodeURIComponent(raw!);

    const stored = await prisma.secureToken.findFirstOrThrow({ where: { teamMemberId: member.id } });
    expect(stored.tokenHash).not.toBe(decoded);
    expect(stored.tokenHash).toBe(hashToken(decoded));
  });

  it("signs the member straight in on a successful invite acceptance", async () => {
    const member = await createTeamMember({ name: "Auto Login", email: "autologin@example.com" });
    await sendTeamMemberInvitation(member.id);
    const raw = extractToken(mockSendEmail.mock.calls[0]![0].html);

    const result = await consumeSetPasswordToken(raw, "somepassword1");
    expect(result.ok).toBe(true);
    expect(result.session).toEqual({
      role: "team",
      teamMemberId: member.id,
      email: member.email,
      name: member.name,
    });
    // Reset/other flows must never carry a session signal.
    expect(result.redirectTo).toBeUndefined();
  });

  it("does not sign a member in via a password-reset token (only a fresh invite does)", async () => {
    const member = await createTeamMember({ name: "Reset Flow", email: "resetflow@example.com" });
    await prisma.teamMember.update({
      where: { id: member.id },
      data: { accountStatus: "ACTIVE", passwordHash: await hashPassword("oldpassword1") },
    });
    const raw = generateRawToken();
    await prisma.secureToken.create({
      data: {
        teamMemberId: member.id,
        type: "PASSWORD_RESET",
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      },
    });

    const result = await consumeSetPasswordToken(raw, "newpassword1");
    expect(result.ok).toBe(true);
    expect(result.session).toBeUndefined();
    expect(result.redirectTo).toBe("/login?passwordSet=1");
  });

  it("refuses to activate an invite for a deactivated team member", async () => {
    const member = await createTeamMember({ name: "Disabled", email: "disabled@example.com" });
    await sendTeamMemberInvitation(member.id);
    const raw = extractToken(mockSendEmail.mock.calls[0]![0].html);
    await setTeamMemberActive(member.id, false);

    const result = await consumeSetPasswordToken(raw, "somepassword1");
    expect(result.ok).toBe(false);

    const stillNoPassword = await prisma.teamMember.findUniqueOrThrow({ where: { id: member.id } });
    expect(stillNoPassword.passwordHash).toBeNull();
  });
});

describe("team member sign-in eligibility", () => {
  it("authenticates an active, activated member with the right password", async () => {
    const member = await createTeamMember({ name: "Login OK", email: "loginok@example.com" });
    await prisma.teamMember.update({
      where: { id: member.id },
      data: { accountStatus: "ACTIVE", passwordHash: await hashPassword("correctpassword1") },
    });

    const authenticated = await authenticateTeamMember("loginok@example.com", "correctpassword1");
    expect(authenticated?.id).toBe(member.id);

    const wrongPassword = await authenticateTeamMember("loginok@example.com", "wrongpassword1");
    expect(wrongPassword).toBeNull();
  });

  it("rejects a deactivated member even with the correct password", async () => {
    const member = await createTeamMember({ name: "Deactivated", email: "deactivated@example.com" });
    await prisma.teamMember.update({
      where: { id: member.id },
      data: { accountStatus: "ACTIVE", passwordHash: await hashPassword("correctpassword1") },
    });
    await setTeamMemberActive(member.id, false);

    const result = await authenticateTeamMember("deactivated@example.com", "correctpassword1");
    expect(result).toBeNull();
  });

  it("rejects a member who has not yet accepted their invitation", async () => {
    const member = await createTeamMember({ name: "Still Invited", email: "stillinvited@example.com" });
    expect(member.accountStatus).toBe("INVITED");

    const result = await authenticateTeamMember("stillinvited@example.com", "anypassword1");
    expect(result).toBeNull();
  });

  it("normalizes email casing/whitespace on lookup", async () => {
    const member = await createTeamMember({ name: "Case", email: "casesensitive@example.com" });
    await prisma.teamMember.update({
      where: { id: member.id },
      data: { accountStatus: "ACTIVE", passwordHash: await hashPassword("correctpassword1") },
    });

    const authenticated = await authenticateTeamMember("  CaseSensitive@Example.com  ", "correctpassword1");
    expect(authenticated?.id).toBe(member.id);
  });
});

describe("cross-role email uniqueness", () => {
  it("refuses to create a team member whose email already belongs to a customer", async () => {
    await prisma.customer.create({
      data: {
        email: "shared@example.com",
        phoneCountry: "BH",
        phoneE164: "+97336001234",
        accountStatus: "ACTIVE",
      },
    });

    await expect(
      createTeamMember({ name: "Duplicate", email: "shared@example.com" })
    ).rejects.toThrow(/already registered/i);
  });

  it("refuses to create a team member whose email already belongs to an admin", async () => {
    await prisma.adminUser.create({
      data: { name: "Admin", email: "admin-shared@example.com", passwordHash: "x", isActive: true },
    });

    await expect(
      createTeamMember({ name: "Duplicate", email: "admin-shared@example.com" })
    ).rejects.toThrow(/already registered/i);
  });

  it("does not block updating a team member's own unchanged email", async () => {
    const { updateTeamMember } = await import("@/lib/services/teamService");
    const member = await createTeamMember({ name: "Self", email: "self@example.com" });

    await expect(
      updateTeamMember(member.id, { name: "Self Renamed", email: "self@example.com" })
    ).resolves.toMatchObject({ name: "Self Renamed" });
  });
});
