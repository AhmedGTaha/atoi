import { describe, it, expect } from "vitest";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { STATUS_LABELS, BUSINESS_TYPE_LABELS } from "@/lib/i18n/labels";

/** Recursively collects every leaf key path in an object, e.g. "auth.signIn.title". */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("dictionary structural parity", () => {
  it("has exactly the same key shape in en and ar", () => {
    const enKeys = keyPaths(dictionaries.en).sort();
    const arKeys = keyPaths(dictionaries.ar).sort();

    expect(arKeys).toEqual(enKeys);
  });

  it("has no empty string values in either locale", () => {
    for (const [locale, dict] of Object.entries(dictionaries)) {
      for (const path of keyPaths(dict)) {
        const value = path
          .split(".")
          .reduce<unknown>((acc, key) => (acc as Record<string, unknown>)[key], dict);
        expect(value, `${locale}.${path} should not be empty`).not.toBe("");
      }
    }
  });
});

describe("label map parity", () => {
  it("STATUS_LABELS has the same status keys in en and ar", () => {
    expect(Object.keys(STATUS_LABELS.ar).sort()).toEqual(
      Object.keys(STATUS_LABELS.en).sort(),
    );
  });

  it("BUSINESS_TYPE_LABELS has the same business-type keys in en and ar", () => {
    expect(Object.keys(BUSINESS_TYPE_LABELS.ar).sort()).toEqual(
      Object.keys(BUSINESS_TYPE_LABELS.en).sort(),
    );
  });
});
