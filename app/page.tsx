import { getLocale } from "@/lib/i18n/getLocale";
import { getWebsiteContent } from "@/lib/services/websiteContentService";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getPublishedPortfolio } from "@/lib/services/portfolioService";
import { PublicHomepage } from "@/components/public/PublicHomepage";
import { publicMetadata } from "@/lib/publicMetadata";

export async function generateMetadata() {
  const locale = await getLocale();
  return publicMetadata(
    "/",
    locale === "ar"
      ? "شركة تطوير برمجيات في البحرين | ATOI"
      : "Software Development Company in Bahrain | ATOI",
    locale === "ar"
      ? "ATOI استوديو تطوير برمجيات مقره البحرين، يبني مواقع وتطبيقات الويب ومنتجات البرمجيات كخدمة وحلول الأتمتة والبرمجيات المخصصة للشركات."
      : "ATOI is a Bahrain-based software development studio building websites, web applications, SaaS products, automation, and custom software for businesses.",
    locale,
  );
}

export default async function HomePage() {
  const [locale, content, settings, portfolio] = await Promise.all([
    getLocale(),
    getWebsiteContent(),
    getCompanySettings(),
    getPublishedPortfolio(),
  ]);

  return (
    <PublicHomepage
      locale={locale}
      content={content}
      settings={settings}
      portfolio={portfolio}
    />
  );
}
