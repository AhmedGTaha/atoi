import { getLocale } from "@/lib/i18n/getLocale";
import { getWebsiteContent } from "@/lib/services/websiteContentService";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getPublishedPortfolio } from "@/lib/services/portfolioService";
import { PublicHomepage } from "@/components/public/PublicHomepage";

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
