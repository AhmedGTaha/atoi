import type { Metadata } from "next";
import { getAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/client";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Middleware already redirects unauthenticated /admin/* requests to
  // /login before they reach this layout — this is a defense-in-depth
  // fallback for the (should-never-happen) case where it didn't.
  if (!session) {
    redirect("/login");
  }

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.adminId },
  });
  if (!admin || !admin.isActive) redirect("/login");

  return <AdminShell adminName={admin.name}>{children}</AdminShell>;
}
