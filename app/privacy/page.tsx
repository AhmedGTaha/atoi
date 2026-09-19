import { ThemeToggle } from "@/components/ThemeToggle";
import type { Metadata } from "next";
import Link from "next/link";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { interpolate, interpolateNodes } from "@/lib/i18n/format";
import { publicMetadata } from "@/lib/publicMetadata";
import { localizedPublicPath } from "@/lib/i18n/publicRoutes";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([
    getCompanySettings(),
    getLocale(),
  ]);
  const dict = getDictionary(locale);
  return publicMetadata(
    "/privacy",
    interpolate(dict.legal.privacy.metaTitle, {
      companyName: settings.companyName,
    }),
    locale === "ar"
      ? "تعرّف على كيفية جمع ATOI لبيانات طلبات المشاريع وبوابة العميل واستخدامها وتخزينها، وكيفية التواصل معنا بشأن بياناتك."
      : "Learn how ATOI collects, uses, and stores project request and customer portal information, and how to contact us about your data.",
    locale,
  );
}

export default async function PrivacyPage() {
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
          href={localizedPublicPath("/", locale)}
          className="text-sm font-semibold text-accent-foreground hover:underline"
        >
          {dict.legal.backHome}
        </Link>
        <ThemeToggle locale={locale} />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-normal">
        {dict.legal.privacy.heading}
      </h1>
      <div className="mt-6 space-y-4 text-foreground/70">
        <p>
          {interpolateNodes(dict.legal.privacy.paragraph1, {
            companyName: companyNode,
          })}
        </p>
        <p>{dict.legal.privacy.paragraph2}</p>
        <p>
          {interpolateNodes(dict.legal.privacy.paragraph3, {
            email: emailNode,
          })}
        </p>
      </div>
    </main>
  );
}
