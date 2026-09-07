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
    <section id="about" className="lp-section lp-tight">
      <Container className="lp-narrow">
        <p className="lp-kicker">
          {locale === "ar" ? "من نحن" : "Who we are"}
        </p>
        <h2 className="lp-h2">{t(content, "about.heading", locale)}</h2>
        <p className="lp-lead">{t(content, "about.body", locale)}</p>
        <div className="lp-steps">
          {[1, 2, 3].map((n) => (
            <div className="lp-step" key={n}>
              <span className="lp-step-no" aria-hidden="true">
                0{n}
              </span>
              <h3>{t(content, `process.step${n}.name`, locale)}</h3>
              <p>{t(content, `process.step${n}.description`, locale)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
