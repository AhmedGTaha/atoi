import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { UniversalLoginForm } from "@/components/auth/UniversalLoginForm";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getAdminSession, getCustomerSession, getTeamSession } from "@/lib/auth/session";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ passwordSet?: string }>;
}) {
  const [adminSession, teamSession, customerSession] = await Promise.all([
    getAdminSession(),
    getTeamSession(),
    getCustomerSession(),
  ]);
  if (adminSession) redirect("/admin");
  if (teamSession) redirect("/team");
  if (customerSession) redirect("/portal");

  const [settings, { passwordSet }] = await Promise.all([getCompanySettings(), searchParams]);

  return (
    <AuthCard title="Sign in" subtitle="One account, everything ATOI." companyName={settings.companyName}>
      <UniversalLoginForm justSetPassword={passwordSet === "1"} />
    </AuthCard>
  );
}
