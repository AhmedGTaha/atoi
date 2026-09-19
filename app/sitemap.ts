import type { MetadataRoute } from "next";
import { PUBLIC_PATHS, publicLanguageUrls } from "@/lib/i18n/publicRoutes";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.flatMap((path) => {
    const languages = publicLanguageUrls(path);
    return (["en", "ar"] as const).map((locale) => ({
      url: languages[locale],
      alternates: { languages },
      ...(path === "/" && { changeFrequency: "weekly" as const, priority: 1 }),
    }));
  });
}
