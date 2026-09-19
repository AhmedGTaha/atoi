import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/locale";
import { PUBLIC_ORIGIN, publicLanguageUrls, type PublicPath } from "@/lib/i18n/publicRoutes";

export const metadataBase = new URL(PUBLIC_ORIGIN);

export function publicMetadata(
  path: PublicPath,
  title: string,
  description: string,
  locale: Locale,
): Metadata {
  const languages = publicLanguageUrls(path);
  const url = languages[locale];
  const imageUrl = new URL("/branding/atoi-og.png", metadataBase).href;
  return {
    // All public URLs are absolute. Skip Next 15's base resolution so the
    // English homepage keeps its root slash in canonicals and hreflang.
    metadataBase: null,
    title,
    description,
    alternates: { canonical: url, languages },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ATOI",
      url,
      title,
      description,
      locale: locale === "ar" ? "ar_BH" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_BH",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "ATOI" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
