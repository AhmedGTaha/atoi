/**
 * GCC-only phone validation and normalization.
 *
 * V1 intentionally supports only the six GCC countries (SRS section 23).
 * Numbers are normalized to E.164 (e.g. "+97312345678") for storage.
 */

export const GCC_COUNTRIES = {
  BH: { dialCode: "+973", digits: 8, label: "Bahrain", flag: "🇧🇭" },
  SA: { dialCode: "+966", digits: 9, label: "Saudi Arabia", flag: "🇸🇦" },
  AE: { dialCode: "+971", digits: 9, label: "United Arab Emirates", flag: "🇦🇪" },
  QA: { dialCode: "+974", digits: 8, label: "Qatar", flag: "🇶🇦" },
  KW: { dialCode: "+965", digits: 8, label: "Kuwait", flag: "🇰🇼" },
  OM: { dialCode: "+968", digits: 8, label: "Oman", flag: "🇴🇲" },
} as const;

export type GccCountryCode = keyof typeof GCC_COUNTRIES;

export const GCC_COUNTRY_CODES = Object.keys(GCC_COUNTRIES) as GccCountryCode[];

export const DEFAULT_GCC_COUNTRY: GccCountryCode = "BH";

export function isGccCountryCode(value: string): value is GccCountryCode {
  return Object.prototype.hasOwnProperty.call(GCC_COUNTRIES, value);
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
 * - Strips spaces, hyphens, parentheses and dots.
 * - Rejects letters and any sign other than a single leading "+".
 * - Accepts the number with or without a redundant country code/leading 0.
 * - Enforces the exact national significant number length for the country.
 */
export function normalizeGccPhone(
  country: string,
  rawInput: string
): PhoneValidationResult {
  if (!isGccCountryCode(country)) {
    return { ok: false, error: "Unsupported country. Only GCC countries are supported." };
  }

  if (typeof rawInput !== "string" || rawInput.trim().length === 0) {
    return { ok: false, error: "Phone number is required." };
  }

  const { dialCode, digits: expectedDigits } = GCC_COUNTRIES[country];
  const dialDigits = dialCode.replace("+", "");
  const trimmed = rawInput.trim();

  // A leading "-" is a negative sign, not formatting, and must be rejected
  // even though internal hyphens (area-code style separators) are harmless.
  if (trimmed.startsWith("-")) {
    return { ok: false, error: "Phone number cannot contain a negative sign." };
  }

  // Remove harmless formatting characters.
  let cleaned = trimmed.replace(/[\s\-().]/g, "");

  if (/[a-zA-Z]/.test(cleaned)) {
    return { ok: false, error: "Phone number cannot contain letters." };
  }

  const hasLeadingPlus = cleaned.startsWith("+");
  if (hasLeadingPlus) {
    cleaned = cleaned.slice(1);
  }

  if (!/^\d+$/.test(cleaned)) {
    return { ok: false, error: "Phone number must contain digits only." };
  }

  // Strip a redundant country code the user may have typed.
  if (cleaned.startsWith(dialDigits)) {
    cleaned = cleaned.slice(dialDigits.length);
  } else if (!hasLeadingPlus && cleaned.startsWith("00" + dialDigits)) {
    cleaned = cleaned.slice(2 + dialDigits.length);
  }

  // Strip a single leading trunk "0" some users type locally.
  if (cleaned.length === expectedDigits + 1 && cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  if (cleaned.length !== expectedDigits) {
    return {
      ok: false,
      error: `Enter a valid ${expectedDigits}-digit number for ${GCC_COUNTRIES[country].label}.`,
    };
  }

  return { ok: true, e164: `${dialCode}${cleaned}` };
}
