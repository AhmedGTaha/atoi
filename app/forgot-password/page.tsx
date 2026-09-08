import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/portal/ForgotPasswordForm";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ForgotPasswordPage() {
  const [settings, locale] = await Promise.all([
    getCompanySettings(),
    getLocale(),
  ]);
  const dict = getDictionary(locale);

  return (
    <AuthCard
      title={dict.auth.forgotPassword.title}
      subtitle={dict.auth.forgotPassword.subtitle}
      companyName={settings.companyName}
      locale={locale}
    >
      <ForgotPasswordForm locale={locale} />
    </AuthCard>
  );
}
