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

export const GCC_COUNTRIES = {
  BH: { label: "Bahrain", flag: "🇧🇭" },
  SA: { label: "Saudi Arabia", flag: "🇸🇦" },
  AE: { label: "United Arab Emirates", flag: "🇦🇪" },
  QA: { label: "Qatar", flag: "🇶🇦" },
  KW: { label: "Kuwait", flag: "🇰🇼" },
  OM: { label: "Oman", flag: "🇴🇲" },
} as const;

export type GccCountryCode = keyof typeof GCC_COUNTRIES;

export const GCC_COUNTRY_CODES = Object.keys(GCC_COUNTRIES) as GccCountryCode[];

export const DEFAULT_GCC_COUNTRY: GccCountryCode = "BH";

export function isGccCountryCode(value: string): value is GccCountryCode {
  return Object.prototype.hasOwnProperty.call(GCC_COUNTRIES, value);
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
  error?: string;
}

/**
 * Normalizes and validates a phone number against one GCC country's rules.
 *
 * - Rejects anything but digits (no spaces, dashes, letters, parentheses).
 * - Enforces the country's real national-number length via libphonenumber-js.
 * - Confirms the number is a plausible number for that country, not just the
 *   right length.
 */
export function normalizeGccPhone(
  country: string,
  rawInput: string
): PhoneValidationResult {
  if (!isGccCountryCode(country)) {
    return { ok: false, error: "Select a supported country." };
  }

  if (typeof rawInput !== "string" || rawInput.trim().length === 0) {
    return { ok: false, error: "Phone number is required." };
  }

  const trimmed = rawInput.trim();
  if (!/^\d+$/.test(trimmed)) {
    return { ok: false, error: "Phone number must contain digits only." };
  }

  const { label } = GCC_COUNTRIES[country];
  const lengthResult = validatePhoneNumberLength(trimmed, {
    defaultCountry: country,
  });

  if (lengthResult === "TOO_SHORT") {
    const { min } = nationalNumberLength(country);
    return {
      ok: false,
      error: `Enter at least ${min} digits for ${label}.`,
    };
  }
  if (lengthResult === "TOO_LONG") {
    const { max } = nationalNumberLength(country);
    return {
      ok: false,
      error: `Enter no more than ${max} digits for ${label}.`,
    };
  }
  if (lengthResult) {
    return { ok: false, error: `Enter a valid phone number for ${label}.` };
  }

  const parsed = parsePhoneNumberFromString(trimmed, country);
  if (!parsed || !parsed.isValid()) {
    return { ok: false, error: `Enter a valid phone number for ${label}.` };
  }

  return { ok: true, e164: parsed.number };
}
