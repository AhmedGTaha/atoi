import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOptionalAdmin } from "@/lib/auth/guards";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already redirects unauthenticated /admin/* requests to
  // /login before they reach this layout — this is a defense-in-depth
  // fallback for the (should-never-happen) case where it didn't. Team
  // member = Admin: getOptionalAdmin accepts either identity.
  const identity = await getOptionalAdmin();
  if (!identity) redirect("/login");

  return <AdminShell adminName={identity.name}>{children}</AdminShell>;
}
