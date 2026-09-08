import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { StartProjectTrigger } from "./StartProjectTrigger";

export function Services({
  locale,
  content,
}: {
  locale: Locale;
  content: WebsiteContentMap;
}) {
  const startProjectLabel = getDictionary(locale).nav.startProject;

  return (
    <section
      id="services"
      className="public-section services-section"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <Container>
        <p className="section-marker mb-5">
          [02] {locale === "ar" ? "ما نبنيه" : "what we build"}
        </p>
        <h2 className="mb-8 max-w-[24ch]">
          {t(content, "services.heading", locale)}
        </h2>
        <div className="services-table">
          {[1, 2, 3, 4, 5, 6].map((n) => {
            const name = t(content, `services.item${n}.name`, locale);
            return (
              <StartProjectTrigger
                key={n}
                className="service-row"
                aria-label={
                  locale === "ar"
                    ? `${startProjectLabel}: ${name}`
                    : `${startProjectLabel} for ${name}`
                }
              >
                <span className="service-index" aria-hidden="true">
                  {String(n).padStart(2, "0")}
                </span>
                <span className="service-name">{name}</span>
                <span className="service-description">
                  {t(content, `services.item${n}.description`, locale)}
                </span>
                <span className="service-duration">
                  [{t(content, `services.item${n}.duration`, locale)}]
                </span>
                <span className="service-action" aria-hidden="true">
                  {startProjectLabel} {locale === "ar" ? "←" : "→"}
                </span>
              </StartProjectTrigger>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
