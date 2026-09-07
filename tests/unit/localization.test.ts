import { describe, it, expect } from "vitest";
import { localize, isLocale, dirFor } from "@/lib/i18n/locale";
import { t } from "@/lib/content/helpers";

describe("localize", () => {
  it("returns the Arabic value when locale is ar", () => {
    expect(localize("ar", { en: "Hello", ar: "مرحبا" })).toBe("مرحبا");
  });

  it("returns the English value when locale is en", () => {
    expect(localize("en", { en: "Hello", ar: "مرحبا" })).toBe("Hello");
  });

  it("falls back to English when the Arabic value is empty", () => {
    expect(localize("ar", { en: "Hello", ar: "" })).toBe("Hello");
  });

  it("supports the valueEn/valueAr field shape used by website content", () => {
    expect(localize("ar", { valueEn: "Hi", valueAr: "أهلاً" })).toBe("أهلاً");
  });
});

describe("isLocale", () => {
  it("accepts en and ar only", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe("dirFor", () => {
  it("is rtl for Arabic and ltr for English", () => {
    expect(dirFor("ar")).toBe("rtl");
    expect(dirFor("en")).toBe("ltr");
  });
});

describe("t (website content lookup)", () => {
  it("falls back to the default map when a key is missing from the DB map", () => {
    expect(t({}, "hero.heading", "en")).toBe(
      "Give us the problem. We ship the software.",
    );
  });

  it("prefers the DB value over the default when present", () => {
    const content = {
      "hero.heading": { valueEn: "Custom heading", valueAr: "عنوان مخصص" },
    };
    expect(t(content, "hero.heading", "en")).toBe("Custom heading");
    expect(t(content, "hero.heading", "ar")).toBe("عنوان مخصص");
  });

  it("returns an empty string for a totally unknown key", () => {
    expect(t({}, "not.a.real.key", "en")).toBe("");
  });
});
