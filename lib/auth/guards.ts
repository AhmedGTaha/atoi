import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getAdminSession, getCustomerSession, getTeamSession } from "./session";

/**
 * Team member = Admin: the shared identity returned for anyone with full
 * admin access, whether they authenticated as an AdminUser or as a
 * TeamMember. There is no lesser "team" permission tier — this is the one
 * place that decides who counts as admin, so callers should never re-derive
 * that decision from role strings or session cookies directly.
 */
export interface AdminAccessIdentity {
  id: string;
  name: string;
  email: string;
  kind: "admin" | "team";
}

/**
 * Re-checks the database on every call (not just the signed cookie) so a
 * deactivated admin/customer/team member is locked out immediately, without
 * waiting for their session to expire.
 */
export async function requireAdmin(): Promise<AdminAccessIdentity> {
  const identity = await getOptionalAdmin();
  if (!identity) redirect("/login");
  return identity;
}

export async function getOptionalAdmin(): Promise<AdminAccessIdentity | null> {
  const adminSession = await getAdminSession();
  if (adminSession) {
    const admin = await prisma.adminUser.findUnique({ where: { id: adminSession.adminId } });
    if (admin && admin.isActive) {
      return { id: admin.id, name: admin.name, email: admin.email, kind: "admin" };
    }
  }

  const teamSession = await getTeamSession();
  if (teamSession) {
    const member = await prisma.teamMember.findUnique({ where: { id: teamSession.teamMemberId } });
    if (member && member.isActive && member.accountStatus === "ACTIVE") {
      return { id: member.id, name: member.name, email: member.email, kind: "team" };
    }
  }

  return null;
}

export async function requireCustomer() {
  const session = await getCustomerSession();
  if (!session) redirect("/login");

  const customer = await prisma.customer.findUnique({ where: { id: session.customerId } });
  if (!customer || customer.accountStatus !== "ACTIVE") redirect("/login");

  return customer;
}

/**
 * The team member's own scoped session (used by the /team portal, which
 * still only shows their assigned projects). This is unrelated to admin
 * access — see requireAdmin, which every team member also passes.
 */
export async function requireTeamMember() {
  const session = await getTeamSession();
  if (!session) redirect("/login");

  const member = await prisma.teamMember.findUnique({ where: { id: session.teamMemberId } });
  if (!member || !member.isActive || member.accountStatus !== "ACTIVE") redirect("/login");

  return member;
}

export async function getOptionalTeamMember() {
  const session = await getTeamSession();
  if (!session) return null;
  const member = await prisma.teamMember.findUnique({ where: { id: session.teamMemberId } });
  if (!member || !member.isActive || member.accountStatus !== "ACTIVE") return null;
  return member;
}
