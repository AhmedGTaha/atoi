import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { UniversalLoginForm } from "@/components/auth/UniversalLoginForm";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getOptionalAdmin, getOptionalCustomer } from "@/lib/auth/guards";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ passwordSet?: string }>;
}) {
  // A signed cookie may outlive its account being disabled or deleted. The
  // middleware can only verify the JWT at the edge, while these helpers also
  // check the database. Redirecting from /login based on the JWT alone would
  // otherwise trap that user in a /login -> protected route redirect loop.
  const [admin, customer] = await Promise.all([
    getOptionalAdmin(),
    getOptionalCustomer(),
  ]);
  if (admin) redirect("/admin");
  if (customer) redirect("/portal");

  const [settings, { passwordSet }] = await Promise.all([
    getCompanySettings(),
    searchParams,
  ]);

  return (
    <AuthCard
      title="Sign in"
      subtitle="One account, everything ATOI."
      companyName={settings.companyName}
    >
      <UniversalLoginForm justSetPassword={passwordSet === "1"} />
    </AuthCard>
  );
}
