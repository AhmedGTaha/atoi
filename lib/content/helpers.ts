import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { DEFAULT_WEBSITE_CONTENT_MAP } from "./defaultWebsiteContent";

export function t(content: WebsiteContentMap, key: string, locale: Locale): string {
  const entry = content[key] ?? DEFAULT_WEBSITE_CONTENT_MAP[key];
  if (!entry) return "";
  return locale === "ar" ? entry.valueAr || entry.valueEn : entry.valueEn;
}
