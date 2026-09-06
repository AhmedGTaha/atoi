import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { SetPasswordForm } from "@/components/portal/SetPasswordForm";
import { getCompanySettings } from "@/lib/services/settingsService";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; mode?: string }>;
}) {
  const [settings, { token, mode }] = await Promise.all([
    getCompanySettings(),
    searchParams,
  ]);

  if (!token) {
    return (
      <AuthCard title="Invalid link" companyName={settings.companyName}>
        <p className="text-ink/70">
          This link is missing its token. Please use the link from your email,
          or request a new one.
        </p>
        <Link className="btn btn-primary mt-6" href="/forgot-password">
          Request a new link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={mode === "reset" ? "Choose a new password" : "Set your password"}
      subtitle="This link can only be used once."
      companyName={settings.companyName}
    >
      <SetPasswordForm token={token} />
    </AuthCard>
  );
}
