import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const settings = await getCompanySettings();

  return (
    <AuthCard
      title="Admin sign in"
      subtitle="Internal ATOI team access."
      companyName={settings.companyName}
    >
      <AdminLoginForm />
    </AuthCard>
  );
}
