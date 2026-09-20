import type { Locale } from "./locale";

export const PUBLIC_ORIGIN = "https://atoi.online";
export const PUBLIC_LOCALE_HEADER = "x-atoi-public-locale";

// Only register published pages with existing English and Arabic content.
// Keep the explicit public middleware matchers in sync when adding pages.
export const PUBLIC_PATHS = [
  "/",
  "/privacy",
  "/terms",
  "/services/custom-software-development",
  "/services/pos-system-development",
  "/services/business-management-systems",
  "/services/inventory-management-systems",
] as const;
export type PublicPath = (typeof PUBLIC_PATHS)[number];

export function localizedPublicPath(path: PublicPath, locale: Locale): string {
  return locale === "ar" ? `/ar${path === "/" ? "" : path}` : path;
}

export function publicRouteFromPath(pathname: string) {
  for (const path of PUBLIC_PATHS) {
    for (const locale of ["en", "ar"] as const) {
      if (pathname === localizedPublicPath(path, locale))
        return { path, locale };
    }
  }
  return null;
}

export function publicLanguageUrls(path: PublicPath) {
  const en = new URL(localizedPublicPath(path, "en"), PUBLIC_ORIGIN).href;
  const ar = new URL(localizedPublicPath(path, "ar"), PUBLIC_ORIGIN).href;
  return { en, ar, "x-default": en };
}
