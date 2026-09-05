import type { Metadata } from "next";
import { getAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // /admin/login renders its own minimal layout (no session yet at that point).
  if (!session) {
    return children;
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: session.adminId } });
  if (!admin || !admin.isActive) redirect("/admin/login");

  return <AdminShell adminName={admin.name}>{children}</AdminShell>;
}
