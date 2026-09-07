import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

export function Services({
  locale,
  content,
}: {
  locale: Locale;
  content: WebsiteContentMap;
}) {
  return (
    <section id="services" className="public-section services-section">
      <Container>
        <p className="section-marker mb-5">
          [02] {locale === "ar" ? "ما نبنيه" : "what we build"}
        </p>
        <h2 className="mb-8 max-w-[24ch]">
          {t(content, "services.heading", locale)}
        </h2>
        <div className="services-table">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="service-row">
              <span className="text-accent font-display">
                {t(content, `services.item${n}.name`, locale)}
              </span>
              <p className="text-muted">
                {t(content, `services.item${n}.description`, locale)}
              </p>
              <span className="service-duration font-display text-faint">
                {t(content, `services.item${n}.duration`, locale)}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
