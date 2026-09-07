import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

export function About({
  locale,
  content,
}: {
  locale: Locale;
  content: WebsiteContentMap;
}) {
  return (
    <section id="about" className="public-section about-section">
      <Container>
        <p className="section-marker mb-6">[03] readme.md</p>
        <div className="readme">
          <h3># {t(content, "process.heading", locale)}</h3>
          {[1, 2, 3].map((n) => (
            <div className="readme-row" key={n}>
              <span className="text-accent" aria-hidden="true">
                →{" "}
              </span>
              {t(content, `process.step${n}`, locale)}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
