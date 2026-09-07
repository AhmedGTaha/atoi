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
        <h2>{t(content, "about.heading", locale)}</h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
          {t(content, "about.body", locale)}
        </p>
        <div className="readme mt-8">
          <h3 className="text-faint">
            # {t(content, "process.heading", locale)}
          </h3>
          {[1, 2, 3].map((n) => (
            <div className="readme-row" key={n}>
              <h4>
                <span className="text-accent" aria-hidden="true">
                  →{" "}
                </span>
                {t(content, `process.step${n}.name`, locale)}
              </h4>
              <p>{t(content, `process.step${n}.description`, locale)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
