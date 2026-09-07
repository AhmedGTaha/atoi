import { getLocale } from "@/lib/i18n/getLocale";
import { getWebsiteContent } from "@/lib/services/websiteContentService";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getPublishedPortfolio } from "@/lib/services/portfolioService";
import { StartProjectModalProvider } from "@/components/public/StartProjectModalProvider";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { Services } from "@/components/public/Services";
import { SelectedWork } from "@/components/public/SelectedWork";
import { About } from "@/components/public/About";
import { FinalCta } from "@/components/public/FinalCta";
import { Footer } from "@/components/public/Footer";
import { StatusBar } from "@/components/public/StatusBar";

export default async function HomePage() {
  const [locale, content, settings, portfolio] = await Promise.all([
    getLocale(),
    getWebsiteContent(),
    getCompanySettings(),
    getPublishedPortfolio(),
  ]);

  return (
    <StartProjectModalProvider locale={locale}>
      <Navbar locale={locale} companyName={settings.companyName} />
      <main id="main-content">
        <Hero locale={locale} content={content} />
        <SelectedWork locale={locale} content={content} projects={portfolio} />
        <Services locale={locale} content={content} />
        <About locale={locale} content={content} />
        <FinalCta locale={locale} content={content} />
      </main>
      <Footer locale={locale} content={content} settings={settings} />
      <StatusBar email={settings.companyEmail} />
    </StartProjectModalProvider>
  );
}
