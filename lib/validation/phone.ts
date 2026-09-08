/**
 * GCC-only phone validation and normalization.
 *
 * V1 intentionally supports only the six GCC countries (SRS section 23).
 * Numbers are normalized to E.164 (e.g. "+97312345678") for storage.
 *
 * Per-country dial codes and national number lengths come from
 * libphonenumber-js's bundled metadata (the same dataset behind Google's
 * libphonenumber) instead of a hand-maintained table, so they stay correct
 * without us tracking numbering-plan changes ourselves.
 */
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  Metadata,
} from "libphonenumber-js/max";
import type { Locale } from "@/lib/i18n/locale";
import type { ErrorCode } from "@/lib/i18n/errors";
import { getErrorMessage } from "@/lib/i18n/errors";

export const GCC_COUNTRIES = {
  BH: { label: "Bahrain", labelAr: "البحرين", flag: "🇧🇭" },
  SA: { label: "Saudi Arabia", labelAr: "المملكة العربية السعودية", flag: "🇸🇦" },
  AE: {
    label: "United Arab Emirates",
    labelAr: "الإمارات العربية المتحدة",
    flag: "🇦🇪",
  },
  QA: { label: "Qatar", labelAr: "قطر", flag: "🇶🇦" },
  KW: { label: "Kuwait", labelAr: "الكويت", flag: "🇰🇼" },
  OM: { label: "Oman", labelAr: "عُمان", flag: "🇴🇲" },
} as const;

export type GccCountryCode = keyof typeof GCC_COUNTRIES;

export const GCC_COUNTRY_CODES = Object.keys(GCC_COUNTRIES) as GccCountryCode[];

export const DEFAULT_GCC_COUNTRY: GccCountryCode = "BH";

export function isGccCountryCode(value: string): value is GccCountryCode {
  return Object.prototype.hasOwnProperty.call(GCC_COUNTRIES, value);
}

/** Locale-appropriate display name for a GCC country. */
export function countryLabel(locale: Locale, country: GccCountryCode): string {
  return locale === "ar" ? GCC_COUNTRIES[country].labelAr : GCC_COUNTRIES[country].label;
}

/** "+973" style dial code, read from libphonenumber-js metadata. */
export function dialCodeFor(country: GccCountryCode): string {
  return `+${getCountryCallingCode(country)}`;
}

/**
 * National significant-number length range for a country (e.g. Bahrain is a
 * fixed 8 digits), read from libphonenumber-js metadata — never hardcoded.
 */
export function nationalNumberLength(country: GccCountryCode): {
  min: number;
  max: number;
} {
  const metadata = new Metadata();
  metadata.selectNumberingPlan(country);
  const lengths = metadata.numberingPlan?.possibleLengths() ?? [];
  if (lengths.length === 0) return { min: 4, max: 15 };
  return { min: Math.min(...lengths), max: Math.max(...lengths) };
}

export interface PhoneValidationResult {
  ok: boolean;
  /** E.164 formatted number, only present when ok is true. */
  e164?: string;
  /** Semantic error code — resolve to text via getErrorMessage(locale, code, errorParams). */
  errorCode?: ErrorCode;
  errorParams?: Record<string, string | number>;
}

/**
 * Normalizes and validates a phone number against one GCC country's rules.
 *
 * - Rejects anything but digits (no spaces, dashes, letters, parentheses).
 * - Enforces the country's real national-number length via libphonenumber-js.
 * - Confirms the number is a plausible number for that country, not just the
 *   right length.
 *
 * Returns a semantic error code (never English/Arabic prose) so callers can
 * resolve it to the requester's locale via lib/i18n/errors.ts.
 */
export function normalizeGccPhone(
  country: string,
  rawInput: string
): PhoneValidationResult {
  if (!isGccCountryCode(country)) {
    return { ok: false, errorCode: "GCC_COUNTRY_REQUIRED" };
  }

  if (typeof rawInput !== "string" || rawInput.trim().length === 0) {
    return { ok: false, errorCode: "PHONE_REQUIRED" };
  }

  const trimmed = rawInput.trim();
  if (!/^\d+$/.test(trimmed)) {
    return { ok: false, errorCode: "PHONE_DIGITS_ONLY" };
  }

  const lengthResult = validatePhoneNumberLength(trimmed, {
    defaultCountry: country,
  });

  if (lengthResult === "TOO_SHORT") {
    const { min } = nationalNumberLength(country);
    return {
      ok: false,
      errorCode: "PHONE_TOO_SHORT",
      errorParams: { min, countryCode: country },
    };
  }
  if (lengthResult === "TOO_LONG") {
    const { max } = nationalNumberLength(country);
    return {
      ok: false,
      errorCode: "PHONE_TOO_LONG",
      errorParams: { max, countryCode: country },
    };
  }
  if (lengthResult) {
    return {
      ok: false,
      errorCode: "PHONE_INVALID_FOR_COUNTRY",
      errorParams: { countryCode: country },
    };
  }

  const parsed = parsePhoneNumberFromString(trimmed, country);
  if (!parsed || !parsed.isValid()) {
    return {
      ok: false,
      errorCode: "PHONE_INVALID_FOR_COUNTRY",
      errorParams: { countryCode: country },
    };
  }

  return { ok: true, e164: parsed.number };
}

/**
 * Resolves a PhoneValidationResult's error into locale-appropriate text,
 * filling in the localized country name from errorParams.countryCode.
 */
export function getPhoneErrorMessage(
  locale: Locale,
  result: PhoneValidationResult
): string | undefined {
  if (!result.errorCode) return undefined;
  const { min, max, countryCode } = result.errorParams ?? {};
  const params: Record<string, string | number> = {};
  if (typeof min === "number") params.min = min;
  if (typeof max === "number") params.max = max;
  if (typeof countryCode === "string" && isGccCountryCode(countryCode)) {
    params.country = countryLabel(locale, countryCode);
  }
  return getErrorMessage(locale, result.errorCode, params);
}
