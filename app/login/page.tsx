import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { CustomerLoginForm } from "@/components/portal/CustomerLoginForm";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getCustomerSession } from "@/lib/auth/session";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CustomerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ passwordSet?: string }>;
}) {
  const session = await getCustomerSession();
  if (session) redirect("/portal");

  const [settings, { passwordSet }] = await Promise.all([
    getCompanySettings(),
    searchParams,
  ]);

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access your project portal."
      companyName={settings.companyName}
    >
      <CustomerLoginForm justSetPassword={passwordSet === "1"} />
    </AuthCard>
  );
}
