import type { Metadata } from "next";
import { requireCustomer } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/getLocale";
import { getCompanySettings } from "@/lib/services/settingsService";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCustomer();
  const [locale, settings] = await Promise.all([
    getLocale(),
    getCompanySettings(),
  ]);

  return (
    <PortalShell locale={locale} companyName={settings.companyName}>
      {children}
    </PortalShell>
  );
}
