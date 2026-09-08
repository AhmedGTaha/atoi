import { ThemeToggle } from "@/components/ThemeToggle";
import type { Metadata } from "next";
import Link from "next/link";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { interpolate, interpolateNodes } from "@/lib/i18n/format";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([
    getCompanySettings(),
    getLocale(),
  ]);
  const dict = getDictionary(locale);
  return {
    title: interpolate(dict.legal.terms.metaTitle, {
      companyName: settings.companyName,
    }),
  };
}

export default async function TermsPage() {
  const [settings, locale] = await Promise.all([
    getCompanySettings(),
    getLocale(),
  ]);
  const dict = getDictionary(locale);

  const companyNode = (
    <bdi key="companyName" dir="ltr">
      {settings.companyName}
    </bdi>
  );
  const emailNode = (
    <bdi key="email" dir="ltr">
      <a href={`mailto:${settings.companyEmail}`} className="underline">
        {settings.companyEmail}
      </a>
    </bdi>
  );

  return (
    <main id="main-content" className="legal-page">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-accent hover:underline"
        >
          {dict.legal.backHome}
        </Link>
        <ThemeToggle locale={locale} />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-normal">
        {dict.legal.terms.heading}
      </h1>
      <div className="mt-6 space-y-4 text-foreground/70">
        <p>
          {interpolateNodes(dict.legal.terms.paragraph1, {
            companyName: companyNode,
          })}
        </p>
        <p>
          {interpolateNodes(dict.legal.terms.paragraph2, {
            companyName: companyNode,
          })}
        </p>
        <p>
          {interpolateNodes(dict.legal.terms.paragraph3, {
            email: emailNode,
          })}
        </p>
      </div>
    </main>
  );
}
