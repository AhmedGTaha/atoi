import { describe, it, expect } from "vitest";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { DEFAULT_WEBSITE_CONTENT } from "@/lib/content/defaultWebsiteContent";
import { DEFAULT_COMPANY_SETTINGS } from "@/lib/content/defaultCompanySettings";

/** Known-bad Arabic forms/phrases that must never reappear in shipped copy. */
const BANNED_PHRASES = [
  "جارِ", // incorrect orthography — should always be "جارٍ" in UI status text
  "أعطنا المشكلة", // literal "give us the problem" mistranslation
  "سنشحن لك البرمجيات", // literal "we'll ship you the software" mistranslation
  "منتجات ساس", // "SaaS" must stay in Latin script, not transliterated
];

function allStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value !== "object" || value === null) return [];
  return Object.values(value as Record<string, unknown>).flatMap(allStrings);
}

describe("Arabic orthography regression", () => {
  const corpus = [
    ...allStrings(dictionaries.ar),
    ...DEFAULT_WEBSITE_CONTENT.map((field) => field.valueAr),
    DEFAULT_COMPANY_SETTINGS.seoTitleAr,
    DEFAULT_COMPANY_SETTINGS.seoDescriptionAr,
  ].join("\n");

  it.each(BANNED_PHRASES)("never contains the banned phrase %s", (phrase) => {
    expect(corpus).not.toContain(phrase);
  });
});
