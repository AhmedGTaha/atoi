import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/locale";

export const metadataBase = new URL("https://atoi.online");

export function publicMetadata(
  path: "/" | "/privacy" | "/terms",
  title: string,
  description: string,
  locale: Locale,
): Metadata {
  const url = new URL(path, metadataBase).href;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "ATOI",
      url,
      title,
      description,
      locale: locale === "ar" ? "ar_BH" : "en_US",
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
