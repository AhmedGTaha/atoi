import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { getAdminSession, getCustomerSession } from "./session";

/**
 * Re-checks the database on every call (not just the signed cookie) so a
 * deactivated admin/customer is locked out immediately, without waiting for
 * their session to expire.
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const admin = await prisma.adminUser.findUnique({ where: { id: session.adminId } });
  if (!admin || !admin.isActive) redirect("/admin/login");

  return admin;
}

export async function getOptionalAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  const admin = await prisma.adminUser.findUnique({ where: { id: session.adminId } });
  if (!admin || !admin.isActive) return null;
  return admin;
}

export async function requireCustomer() {
  const session = await getCustomerSession();
  if (!session) redirect("/login");

  const customer = await prisma.customer.findUnique({ where: { id: session.customerId } });
  if (!customer || customer.accountStatus !== "ACTIVE") redirect("/login");

  return customer;
}
