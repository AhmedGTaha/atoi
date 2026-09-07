import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/getLocale";
import { dirFor } from "@/lib/i18n/locale";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { getCompanySettings } from "@/lib/services/settingsService";
import { appUrl } from "@/lib/utils/appUrl";

const latin = IBM_Plex_Sans({
  variable: "--font-latin",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const arabic = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [locale, settings] = await Promise.all([
    getLocale(),
    getCompanySettings(),
  ]);
  const title = locale === "ar" ? settings.seoTitleAr : settings.seoTitleEn;
  const description =
    locale === "ar" ? settings.seoDescriptionAr : settings.seoDescriptionEn;

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
    <html
      suppressHydrationWarning
      data-theme="dark"
      lang={locale}
      dir={dirFor(locale)}
      className={`${latin.variable} ${mono.variable} ${arabic.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('atoi-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-foreground">
        <a href="#main-content" className="skip-link">
          {locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
        </a>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
