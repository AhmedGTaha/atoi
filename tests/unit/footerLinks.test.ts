import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Footer } from "@/components/public/Footer";
import type { CompanySettingsWithLogos } from "@/lib/services/settingsService";

const settings = {
  companyName: "ATOI",
  companyEmail: "info@atoi.online",
  companyPhone: "+973 0000 0000",
  whatsappPhone: null,
  instagramUrl: null,
  linkedinUrl: null,
  locationEn: "Bahrain",
  locationAr: "البحرين",
  logoPublicUrl: null,
  activeLightLogo: null,
  activeDarkLogo: null,
} as unknown as CompanySettingsWithLogos;

const content = {
  "footer.tagline": { valueEn: "Software studio", valueAr: "استوديو برمجيات" },
};

function renderFooter(locale: "en" | "ar") {
  return renderToStaticMarkup(
    createElement(Footer, { locale, content, settings }),
  );
}

describe("public footer legal links", () => {
  it("links English pages to the English legal URLs", () => {
    const html = renderFooter("en");
    expect(html).toContain('href="/privacy"');
    expect(html).toContain(">Privacy Policy</a>");
    expect(html).toContain('href="/terms"');
    expect(html).toContain(">Terms of Service</a>");
    expect(html).not.toContain('href="/ar/privacy"');
  });

  it("links Arabic pages to the Arabic legal URLs", () => {
    const html = renderFooter("ar");
    expect(html).toContain('href="/ar/privacy"');
    expect(html).toContain(">سياسة الخصوصية</a>");
    expect(html).toContain('href="/ar/terms"');
    expect(html).toContain(">الشروط والأحكام</a>");
    expect(html).not.toContain('href="/privacy"');
  });
});
