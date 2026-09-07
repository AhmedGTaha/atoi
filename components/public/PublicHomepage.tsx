import type { CompanySettings } from "@prisma/client";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";
import { StartProjectModalProvider } from "./StartProjectModalProvider";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { SelectedWork } from "./SelectedWork";
import { Services } from "./Services";
import { About } from "./About";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { StatusBar } from "./StatusBar";

export function PublicHomepage({
  locale,
  content,
  settings,
  portfolio,
  previewMode = false,
  onLocaleChange,
}: {
  locale: Locale;
  content: WebsiteContentMap;
  settings: CompanySettings;
  portfolio: PortfolioProjectWithImages[];
  previewMode?: boolean;
  onLocaleChange?: (locale: Locale) => void;
}) {
  return (
    <StartProjectModalProvider locale={locale}>
      <Navbar
        locale={locale}
        companyName={settings.companyName}
        previewMode={previewMode}
        onLocaleChange={onLocaleChange}
      />
      <main id="main-content">
        <Hero locale={locale} content={content} previewMode={previewMode} />
        <SelectedWork
          locale={locale}
          content={content}
          projects={portfolio}
        />
        <Services locale={locale} content={content} />
        <About locale={locale} content={content} />
        <FinalCta
          locale={locale}
          content={content}
          companyEmail={settings.companyEmail}
        />
      </main>
      <Footer locale={locale} content={content} settings={settings} />
      <StatusBar email={settings.companyEmail} />
    </StartProjectModalProvider>
  );
}
