import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Cairo } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/getLocale";
import { dirFor } from "@/lib/i18n/locale";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { getCompanySettings } from "@/lib/services/settingsService";
import { appUrl } from "@/lib/utils/appUrl";

const latin = Barlow({
  variable: "--font-latin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const condensed = Barlow_Condensed({ variable: "--font-condensed", subsets: ["latin"], weight: ["400", "600"], display: "swap" });

const arabic = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [locale, settings] = await Promise.all([getLocale(), getCompanySettings()]);
  const title = locale === "ar" ? settings.seoTitleAr : settings.seoTitleEn;
  const description = locale === "ar" ? settings.seoDescriptionAr : settings.seoDescriptionEn;

  return {
    metadataBase: new URL(appUrl()),
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: appUrl(),
      siteName: settings.companyName,
      locale: locale === "ar" ? "ar_BH" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir={dirFor(locale)} className={`${latin.variable} ${condensed.variable} ${arabic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <a href="#main-content" className="skip-link">{locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
