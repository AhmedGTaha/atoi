import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/getLocale";
import { dirFor } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
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
    applicationName: settings.companyName,
    appleWebApp: {
      title: settings.companyName,
    },
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: appUrl(),
      siteName: settings.companyName,
      locale: locale === "ar" ? "ar_BH" : "en_US",
      type: "website",
      images: [{ url: "/branding/atoi-og.png", width: 1200, height: 630, alt: "ATOI" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/branding/atoi-og.png"],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      dir={dirFor(locale)}
      className={`${latin.variable} ${mono.variable} ${arabic.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var root=document.documentElement;var media=window.matchMedia('(prefers-color-scheme: light)');var apply=function(theme){root.dataset.theme=theme};try{var saved=localStorage.getItem('atoi-theme');if(saved==='light'||saved==='dark'){apply(saved);return}}catch(e){}apply(media.matches?'light':'dark');if(!window.__atoiSystemThemeListener){var sync=function(event){try{if(localStorage.getItem('atoi-theme'))return}catch(e){}apply(event.matches?'light':'dark')};if(media.addEventListener)media.addEventListener('change',sync);else media.addListener(sync);window.__atoiSystemThemeListener=true}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-foreground">
        <a href="#main-content" className="skip-link">
          {dict.nav.skipToContent}
        </a>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
