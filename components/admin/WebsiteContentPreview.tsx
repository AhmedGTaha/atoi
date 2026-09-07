"use client";

import { useEffect, useState } from "react";
import type { CompanySettings } from "@prisma/client";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";
import {
  WEBSITE_PREVIEW_LOCALE,
  WEBSITE_PREVIEW_READY,
  WEBSITE_PREVIEW_UPDATE,
  type WebsitePreviewSection,
  type WebsitePreviewUpdateMessage,
} from "@/lib/content/websitePreview";
import { PublicHomepage } from "@/components/public/PublicHomepage";

const SECTION_IDS: Record<WebsitePreviewSection, string> = {
  hero: "home",
  services: "services",
  process: "about",
  work: "work",
  finalCta: "contact",
  footer: "footer",
};

export function WebsiteContentPreview({
  initialContent,
  settings,
  portfolio,
}: {
  initialContent: WebsiteContentMap;
  settings: CompanySettings;
  portfolio: PortfolioProjectWithImages[];
}) {
  const [content, setContent] = useState(initialContent);
  const [locale, setLocale] = useState<Locale>("en");
  const [section, setSection] = useState<WebsitePreviewSection>("hero");

  useEffect(() => {
    function receivePreviewUpdate(
      event: MessageEvent<WebsitePreviewUpdateMessage>,
    ) {
      if (
        event.origin !== window.location.origin ||
        event.source !== window.parent ||
        event.data?.type !== WEBSITE_PREVIEW_UPDATE
      ) {
        return;
      }
      setContent(event.data.content);
      setLocale(event.data.locale);
      setSection(event.data.section);
    }

    window.addEventListener("message", receivePreviewUpdate);
    window.parent.postMessage(
      { type: WEBSITE_PREVIEW_READY },
      window.location.origin,
    );
    return () => window.removeEventListener("message", receivePreviewUpdate);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    document.getElementById(SECTION_IDS[section])?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [section]);

  function changeLocale(next: Locale) {
    setLocale(next);
    window.parent.postMessage(
      { type: WEBSITE_PREVIEW_LOCALE, locale: next },
      window.location.origin,
    );
  }

  return (
    <div className="public-site-preview" dir={locale === "ar" ? "rtl" : "ltr"}>
      <PublicHomepage
        locale={locale}
        content={content}
        settings={settings}
        portfolio={portfolio}
        previewMode
        onLocaleChange={changeLocale}
      />
    </div>
  );
}
