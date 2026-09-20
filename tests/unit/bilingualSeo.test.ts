import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { middleware, config } from "@/middleware";
import { getLocale } from "@/lib/i18n/getLocale";
import {
  PUBLIC_LOCALE_HEADER,
  PUBLIC_PATHS,
  localizedPublicPath,
  publicLanguageUrls,
} from "@/lib/i18n/publicRoutes";
import { publicMetadata } from "@/lib/publicMetadata";
import sitemap from "@/app/sitemap";

const request = vi.hoisted(() => ({ headers: new Headers(), cookie: "" }));
vi.mock("next/headers", () => ({
  headers: async () => request.headers,
  cookies: async () => ({ get: () => ({ value: request.cookie }) }),
}));

beforeEach(() => {
  request.headers = new Headers();
  request.cookie = "";
});

describe("public language URLs", () => {
  for (const path of PUBLIC_PATHS) {
    for (const locale of ["en", "ar"] as const) {
      const pathname = localizedPublicPath(path, locale);
      it(`${pathname} uses its URL language despite conflicting preferences`, async () => {
        const opposite = locale === "en" ? "ar" : "en";
        const headers = new Headers({
          cookie: `atoi_locale=${opposite}`,
          "accept-language": opposite,
          [PUBLIC_LOCALE_HEADER]: opposite,
        });
        expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url: pathname })).toBe(true);
        const response = await middleware(new NextRequest(`https://atoi.online${pathname}?ref=test`, { headers }));
        expect(response.headers.get("location")).toBeNull();
        const rewrite = response.headers.get("x-middleware-rewrite");
        if (locale === "ar") {
          expect(new URL(rewrite!).pathname).toBe(path);
          expect(new URL(rewrite!).search).toBe("?ref=test");
        } else {
          expect(rewrite).toBeNull();
        }
        request.headers.set(PUBLIC_LOCALE_HEADER, response.headers.get(`x-middleware-request-${PUBLIC_LOCALE_HEADER}`)!);
        request.headers.set("accept-language", opposite);
        request.cookie = opposite;
        expect(await getLocale()).toBe(locale);

        const metadata = publicMetadata(path, `${locale} title`, `${locale} description`, await getLocale());
        expect(metadata.alternates).toEqual({ canonical: `https://atoi.online${pathname}`, languages: publicLanguageUrls(path) });
        expect(metadata.openGraph?.url).toBe(`https://atoi.online${pathname}`);
        expect(metadata.robots).toEqual({ index: true, follow: true });
      });
    }
  }

  it("publishes only existing bilingual pages, with reciprocal alternates", () => {
    const entries = sitemap();
    expect(entries.map((entry) => entry.url)).toEqual([
      "https://atoi.online/", "https://atoi.online/ar",
      "https://atoi.online/privacy", "https://atoi.online/ar/privacy",
      "https://atoi.online/terms", "https://atoi.online/ar/terms",
      "https://atoi.online/services/custom-software-development", "https://atoi.online/ar/services/custom-software-development",
      "https://atoi.online/services/pos-system-development", "https://atoi.online/ar/services/pos-system-development",
    ]);
    expect(entries[0].alternates?.languages).toEqual({
      en: "https://atoi.online/", ar: "https://atoi.online/ar", "x-default": "https://atoi.online/",
    });
    for (let i = 0; i < entries.length; i += 2) {
      expect(entries[i].alternates).toEqual(entries[i + 1].alternates);
    }
  });

  it("does not create private aliases, unapproved services, location, or unknown pages", () => {
    for (const url of ["/ar/admin", "/ar/portal", "/ar/login", "/ar/team", "/ar/unknown", "/services/erp", "/ar/services/crm", "/ar/saudi-arabia"]) {
      expect(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url })).toBe(false);
    }
  });

  it("retains cookie and browser preferences outside the public namespace", async () => {
    request.headers.set("accept-language", "ar-BH");
    request.cookie = "en";
    expect(await getLocale()).toBe("en");
    request.cookie = "";
    expect(await getLocale()).toBe("ar");
  });

  it("removes a spoofed public locale header on authentication pages", async () => {
    const response = await middleware(new NextRequest("https://atoi.online/login", {
      headers: { [PUBLIC_LOCALE_HEADER]: "ar" },
    }));
    expect(response.headers.get(`x-middleware-request-${PUBLIC_LOCALE_HEADER}`)).toBeNull();
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
  });
});
