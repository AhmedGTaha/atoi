import { describe, expect, it } from "vitest";
import { SERVICE_CONTENT, SERVICE_PATHS } from "@/lib/content/services";
import { publicMetadata } from "@/lib/publicMetadata";

describe("service page SEO contract", () => {
  it("has four distinct titles and descriptions with the intended positioning", () => {
    const copies = Object.values(SERVICE_CONTENT).flatMap((service) =>
      Object.values(service),
    );
    expect(new Set(copies.map((copy) => copy.title)).size).toBe(4);
    expect(new Set(copies.map((copy) => copy.description)).size).toBe(4);
    expect(SERVICE_CONTENT.custom.en.title).toBe(
      "Custom Software Development Company | ATOI",
    );
    expect(SERVICE_CONTENT.pos.en.title).toBe(
      "Custom POS System Development | ATOI",
    );
    expect(SERVICE_CONTENT.custom.ar.heading).toBe(
      "نطوّر نظامًا يناسب طريقة عمل شركتك",
    );
    expect(SERVICE_CONTENT.pos.ar.heading).toBe(
      "نظام نقاط بيع مصمم لطريقة عمل نشاطك",
    );
  });

  for (const service of ["custom", "pos"] as const) {
    for (const locale of ["en", "ar"] as const) {
      it(`${service}/${locale} has matching search and social metadata`, () => {
        const copy = SERVICE_CONTENT[service][locale];
        const metadata = publicMetadata(
          SERVICE_PATHS[service],
          copy.title,
          copy.description,
          locale,
        );
        expect(metadata.title).toBe(copy.title);
        expect(metadata.description).toBe(copy.description);
        expect(metadata.openGraph?.title).toBe(copy.title);
        expect(metadata.openGraph?.description).toBe(copy.description);
        expect(metadata.twitter?.title).toBe(copy.title);
        expect(metadata.twitter?.description).toBe(copy.description);
        if (locale === "ar") {
          for (const faq of copy.faqs) {
            expect(faq.title).toMatch(/[\u0600-\u06ff]/);
            expect(faq.text).toMatch(/[\u0600-\u06ff]/);
          }
        }
      });
    }
  }
});
