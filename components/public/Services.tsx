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
        <div className="mb-8 flex flex-wrap justify-between gap-6 border-b pb-8">
          <h2>{t(content, "services.heading", locale)}</h2>
          <p className="max-w-sm text-muted">
            {t(content, "services.body", locale)}
          </p>
        </div>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="service-row">
            <span className="section-marker">0{n}</span>
            <h3 className="service-name">
              {t(content, `services.item${n}.name`, locale)}
            </h3>
            <p className="text-muted">
              {t(content, `services.item${n}.description`, locale)}
            </p>
          </div>
        ))}
      </Container>
    </section>
  );
}
