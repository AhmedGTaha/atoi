import { describe, it, expect } from "vitest";
import {
  normalizeGccPhone,
  isGccCountryCode,
  DEFAULT_GCC_COUNTRY,
  dialCodeFor,
  nationalNumberLength,
  countryLabel,
  getPhoneErrorMessage,
  GCC_COUNTRY_CODES,
} from "@/lib/validation/phone";

describe("normalizeGccPhone", () => {
  it("defaults to Bahrain +973", () => {
    expect(DEFAULT_GCC_COUNTRY).toBe("BH");
    expect(dialCodeFor("BH")).toBe("+973");
  });

  it("reads Bahrain's national number length (8 digits) from real metadata", () => {
    expect(nationalNumberLength("BH")).toEqual({ min: 8, max: 8 });
  });

  it("normalizes a plain 8-digit Bahrain number", () => {
    const result = normalizeGccPhone("BH", "36001234");
    expect(result.ok).toBe(true);
    expect(result.e164).toBe("+97336001234");
  });

  it("validates Saudi Arabia's 9-digit numbers", () => {
    const result = normalizeGccPhone("SA", "512345678");
    expect(result.ok).toBe(true);
    expect(result.e164).toBe("+966512345678");
  });

  it("rejects spaces, dashes, and other formatting characters", () => {
    expect(normalizeGccPhone("BH", "3600 1234").ok).toBe(false);
    expect(normalizeGccPhone("BH", "3600-1234").ok).toBe(false);
    expect(normalizeGccPhone("BH", "(3600)1234").ok).toBe(false);
  });

  it("rejects a leading plus / redundant country code", () => {
    expect(normalizeGccPhone("BH", "+97336001234").ok).toBe(false);
  });

  it("rejects a redundant leading trunk zero", () => {
    expect(normalizeGccPhone("BH", "036001234").ok).toBe(false);
  });

  it("rejects letters", () => {
    const result = normalizeGccPhone("BH", "3600abcd");
    expect(result.ok).toBe(false);
  });

  it("rejects a negative sign", () => {
    const result = normalizeGccPhone("BH", "-36001234");
    expect(result.ok).toBe(false);
  });

  it("rejects too few digits for the country", () => {
    const result = normalizeGccPhone("BH", "123");
    expect(result.ok).toBe(false);
  });

  it("rejects too many digits for the country", () => {
    const result = normalizeGccPhone("BH", "3600123456");
    expect(result.ok).toBe(false);
  });

  it("rejects a non-GCC country code", () => {
    const result = normalizeGccPhone("US", "5551234567");
    expect(result.ok).toBe(false);
  });

  it("rejects an empty number", () => {
    const result = normalizeGccPhone("BH", "");
    expect(result.ok).toBe(false);
  });
});

describe("countryLabel", () => {
  it("returns an Arabic name for every GCC country", () => {
    const arabicNames: Record<string, string> = {
      BH: "البحرين",
      SA: "المملكة العربية السعودية",
      AE: "الإمارات العربية المتحدة",
      QA: "قطر",
      KW: "الكويت",
      OM: "عُمان",
    };
    for (const code of GCC_COUNTRY_CODES) {
      expect(countryLabel("ar", code)).toBe(arabicNames[code]);
      expect(countryLabel("en", code)).toMatch(/[a-zA-Z]/);
    }
  });
});

describe("getPhoneErrorMessage", () => {
  it("resolves a phone validation error to localized text with the country name interpolated", () => {
    const result = normalizeGccPhone("BH", "123");
    expect(result.ok).toBe(false);
    const ar = getPhoneErrorMessage("ar", result);
    const en = getPhoneErrorMessage("en", result);
    expect(ar).toContain("البحرين");
    expect(en).toMatch(/Bahrain/i);
  });

  it("returns undefined for a successful result", () => {
    const result = normalizeGccPhone("BH", "36001234");
    expect(getPhoneErrorMessage("ar", result)).toBeUndefined();
  });
});

describe("isGccCountryCode", () => {
  it("accepts all six GCC codes and nothing else", () => {
    for (const code of ["BH", "SA", "AE", "QA", "KW", "OM"]) {
      expect(isGccCountryCode(code)).toBe(true);
    }
    expect(isGccCountryCode("US")).toBe(false);
    expect(isGccCountryCode("GB")).toBe(false);
  });
});
