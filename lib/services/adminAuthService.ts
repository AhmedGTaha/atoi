import "server-only";
import { prisma } from "@/lib/db/client";
import { verifyPassword } from "@/lib/auth/password";
import type { AdminUser } from "@prisma/client";

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  const admin = await prisma.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!admin || !admin.isActive) return null;

  const valid = await verifyPassword(password, admin.passwordHash);
  return valid ? admin : null;
}

export async function listAdmins() {
  return prisma.adminUser.findMany({ orderBy: { name: "asc" } });
}
