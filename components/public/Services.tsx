import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { StartProjectTrigger } from "./StartProjectTrigger";
import { MotionReveal } from "./MotionReveal";

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
      className="public-section services-section motion-section"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <Container>
        <MotionReveal
          as="p"
          className="section-marker section-marker-reveal mb-5"
        >
          [02] {locale === "ar" ? "ما نبنيه" : "what we build"}
        </MotionReveal>
        <MotionReveal as="h2" className="mb-8 max-w-[24ch]" delay={70}>
          {t(content, "services.heading", locale)}
        </MotionReveal>
        <div className="services-table">
          {[1, 2, 3, 4, 5, 6].map((n) => {
            const name = t(content, `services.item${n}.name`, locale);
            return (
              <MotionReveal
                key={n}
                className="motion-service-row"
                delay={120 + n * 60}
              >
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
              </MotionReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
