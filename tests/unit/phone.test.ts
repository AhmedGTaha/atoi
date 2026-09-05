import { describe, it, expect } from "vitest";
import { normalizeGccPhone, isGccCountryCode, DEFAULT_GCC_COUNTRY, GCC_COUNTRIES } from "@/lib/validation/phone";

describe("normalizeGccPhone", () => {
  it("defaults to Bahrain +973", () => {
    expect(DEFAULT_GCC_COUNTRY).toBe("BH");
    expect(GCC_COUNTRIES.BH.dialCode).toBe("+973");
  });

  it("normalizes a plain 8-digit Bahrain number", () => {
    const result = normalizeGccPhone("BH", "36001234");
    expect(result.ok).toBe(true);
    expect(result.e164).toBe("+97336001234");
  });

  it("strips spaces and hyphens", () => {
    const result = normalizeGccPhone("BH", "3600-1234");
    expect(result.ok).toBe(true);
    expect(result.e164).toBe("+97336001234");
  });

  it("accepts a number that already includes the country code", () => {
    const result = normalizeGccPhone("BH", "+97336001234");
    expect(result.ok).toBe(true);
    expect(result.e164).toBe("+97336001234");
  });

  it("strips a redundant leading trunk zero", () => {
    const result = normalizeGccPhone("BH", "036001234");
    expect(result.ok).toBe(true);
    expect(result.e164).toBe("+97336001234");
  });

  it("validates Saudi Arabia's 9-digit numbers", () => {
    const result = normalizeGccPhone("SA", "512345678");
    expect(result.ok).toBe(true);
    expect(result.e164).toBe("+966512345678");
  });

  it("rejects letters", () => {
    const result = normalizeGccPhone("BH", "3600abcd");
    expect(result.ok).toBe(false);
  });

  it("rejects a negative sign", () => {
    const result = normalizeGccPhone("BH", "-36001234");
    expect(result.ok).toBe(false);
  });

  it("rejects the wrong number of digits", () => {
    const result = normalizeGccPhone("BH", "123");
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

describe("isGccCountryCode", () => {
  it("accepts all six GCC codes and nothing else", () => {
    for (const code of ["BH", "SA", "AE", "QA", "KW", "OM"]) {
      expect(isGccCountryCode(code)).toBe(true);
    }
    expect(isGccCountryCode("US")).toBe(false);
    expect(isGccCountryCode("GB")).toBe(false);
  });
});
