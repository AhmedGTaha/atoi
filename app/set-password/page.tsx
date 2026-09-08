import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";
import { SetPasswordForm } from "@/components/portal/SetPasswordForm";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; mode?: string }>;
}) {
  const [settings, { token, mode }, locale] = await Promise.all([
    getCompanySettings(),
    searchParams,
    getLocale(),
  ]);
  const dict = getDictionary(locale);

  if (!token) {
    return (
      <AuthCard
        title={dict.auth.setPassword.invalidLinkTitle}
        companyName={settings.companyName}
        locale={locale}
      >
        <p className="text-foreground/70">
          {dict.auth.setPassword.missingTokenMessage}
        </p>
        <Link className="btn btn-primary mt-6" href="/forgot-password">
          {dict.auth.setPassword.requestNewLink}
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={
        mode === "reset"
          ? dict.auth.setPassword.resetTitle
          : dict.auth.setPassword.invitationTitle
      }
      subtitle={dict.auth.setPassword.subtitle}
      companyName={settings.companyName}
      locale={locale}
    >
      <SetPasswordForm token={token} mode={mode} locale={locale} />
    </AuthCard>
  );
}
