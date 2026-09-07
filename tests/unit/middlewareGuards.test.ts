import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { createAdminSession, createTeamSession, createCustomerSession } from "@/lib/auth/session";
import { __resetCookieStore } from "../stubs/next-headers";
import { cookies } from "next/headers";

function requestFor(path: string, cookieHeader?: string): NextRequest {
  return new NextRequest(new URL(path, "https://atoi.online"), {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });
}

/** Reads the stubbed cookie jar (populated by create*Session) into a real `Cookie` header string. */
async function currentCookieHeader(): Promise<string> {
  const store = await cookies();
  const names = ["atoi_admin_session", "atoi_team_session", "atoi_customer_session"];
  return names
    .map((name) => {
      const c = store.get(name);
      return c ? `${name}=${c.value}` : null;
    })
    .filter(Boolean)
    .join("; ");
}

describe("middleware — /admin/login retirement", () => {
  it("permanently redirects /admin/login to /login", async () => {
    const res = await middleware(requestFor("/admin/login"));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  });
});

describe("middleware — route guards", () => {
  it("redirects unauthenticated /admin/* to /login", async () => {
    const res = await middleware(requestFor("/admin"));
    expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  });

  it("redirects unauthenticated /portal/* to /login", async () => {
    const res = await middleware(requestFor("/portal"));
    expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  });

  it("redirects unauthenticated /team/* to /login", async () => {
    const res = await middleware(requestFor("/team"));
    expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  });

  it("lets an admin session through to /admin", async () => {
    __resetCookieStore();
    await createAdminSession({ role: "admin", adminId: "a1", email: "a@example.com", name: "A" });
    const cookieHeader = await currentCookieHeader();

    const res = await middleware(requestFor("/admin/projects", cookieHeader));
    expect(res.headers.get("location")).toBeNull();
  });

  it("lets a team session through to /team but not to /admin", async () => {
    __resetCookieStore();
    await createTeamSession({ role: "team", teamMemberId: "t1", email: "t@example.com", name: "T" });
    const cookieHeader = await currentCookieHeader();

    const teamRes = await middleware(requestFor("/team", cookieHeader));
    expect(teamRes.headers.get("location")).toBeNull();

    const adminRes = await middleware(requestFor("/admin", cookieHeader));
    expect(new URL(adminRes.headers.get("location")!).pathname).toBe("/login");
  });

  it("lets a customer session through to /portal but not to /team", async () => {
    __resetCookieStore();
    await createCustomerSession({ role: "customer", customerId: "c1", email: "c@example.com" });
    const cookieHeader = await currentCookieHeader();

    const portalRes = await middleware(requestFor("/portal", cookieHeader));
    expect(portalRes.headers.get("location")).toBeNull();

    const teamRes = await middleware(requestFor("/team", cookieHeader));
    expect(new URL(teamRes.headers.get("location")!).pathname).toBe("/login");
  });

  it("does not touch unrelated public routes", async () => {
    const res = await middleware(requestFor("/"));
    expect(res.headers.get("location")).toBeNull();
  });
});
