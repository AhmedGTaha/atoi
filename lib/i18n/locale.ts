export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "atoi_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Picks the field for the given locale, falling back to English. */
export function localize(
  locale: Locale,
  value: { en: string; ar: string } | { valueEn: string; valueAr: string }
): string {
  if ("en" in value) {
    return locale === "ar" ? value.ar || value.en : value.en;
  }
  return locale === "ar" ? value.valueAr || value.valueEn : value.valueEn;
}
