import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";

export const WEBSITE_PREVIEW_UPDATE = "atoi:website-preview:update";
export const WEBSITE_PREVIEW_READY = "atoi:website-preview:ready";
export const WEBSITE_PREVIEW_LOCALE = "atoi:website-preview:locale";

export type WebsitePreviewSection =
  "hero" | "services" | "process" | "work" | "finalCta" | "footer";

export interface WebsitePreviewUpdateMessage {
  type: typeof WEBSITE_PREVIEW_UPDATE;
  locale: Locale;
  content: WebsiteContentMap;
  section: WebsitePreviewSection;
}
