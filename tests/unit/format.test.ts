import { describe, it, expect } from "vitest";
import { localeTag, formatDate, formatNumber, formatPercent, interpolate } from "@/lib/i18n/format";
import { dictionaries } from "@/lib/i18n/dictionaries";

describe("localeTag", () => {
  it("maps ar to ar-BH and en to an English tag", () => {
    expect(localeTag("ar")).toBe("ar-BH");
    expect(localeTag("en")).not.toBe("ar-BH");
    expect(localeTag("en")).toMatch(/^en-/);
  });
});

describe("formatDate", () => {
  it("formats the same date differently for ar and en", () => {
    const date = new Date("2026-03-05T00:00:00Z");
    const ar = formatDate("ar", date);
    const en = formatDate("en", date);
    expect(ar).not.toBe(en);
    expect(ar.length).toBeGreaterThan(0);
  });
});

describe("formatNumber", () => {
  it("renders Arabic-Indic digits for ar and Western digits for en", () => {
    expect(formatNumber("en", 12)).toBe("12");
    // Arabic-Indic digit for 1 and 2 respectively.
    expect(formatNumber("ar", 12)).toContain("١");
  });
});

describe("formatPercent", () => {
  it("appends a percent sign for a 0-100 progress value", () => {
    expect(formatNumber("en", 100)).toBe("100");
    expect(formatPercent("en", 42)).toContain("42");
    expect(formatPercent("en", 42)).toContain("%");
  });
});

describe("interpolate", () => {
  it("replaces {key} placeholders", () => {
    expect(interpolate("Hello {name}", { name: "ATOI" })).toBe("Hello ATOI");
  });

  it("leaves unknown placeholders untouched", () => {
    expect(interpolate("Hello {name}", {})).toBe("Hello {name}");
  });

  it("returns the template unchanged when no params are given", () => {
    expect(interpolate("Plain text")).toBe("Plain text");
  });
});

describe("gallery position label (ProjectGallery a11y string)", () => {
  it("renders Arabic-Indic digits with 'من', not the English '1 of 4' pattern", () => {
    const label = interpolate(dictionaries.ar.gallery.positionLabel, {
      index: formatNumber("ar", 1),
      count: formatNumber("ar", 4),
    });
    expect(label).toBe("الصورة ١ من ٤");
    expect(label).not.toMatch(/\d/); // no Western digits
    expect(label).not.toMatch(/of/i);
  });

  it("renders the English pattern with 'of' for the en locale", () => {
    const label = interpolate(dictionaries.en.gallery.positionLabel, {
      index: formatNumber("en", 1),
      count: formatNumber("en", 4),
    });
    expect(label).toBe("Image 1 of 4");
  });
});
