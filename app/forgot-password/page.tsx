import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/portal/ForgotPasswordForm";
import { getCompanySettings } from "@/lib/services/settingsService";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ForgotPasswordPage() {
  const settings = await getCompanySettings();

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      companyName={settings.companyName}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
