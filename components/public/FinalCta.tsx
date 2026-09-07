import { Container } from "@/components/ui/Container";
import { StartProjectTrigger } from "./StartProjectTrigger";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

export function FinalCta({
  locale,
  content,
}: {
  locale: Locale;
  content: WebsiteContentMap;
}) {
  return (
    <section id="contact" className="lp-cta">
      <Container className="lp-cta-inner">
        <p className="lp-kicker light">
          {t(content, "finalCta.eyebrow", locale)}
        </p>
        <h2 className="lp-cta-title">
          {t(content, "finalCta.heading", locale)}
        </h2>
        <p className="lp-cta-sub">{t(content, "finalCta.body", locale)}</p>
        <StartProjectTrigger className="btn btn-primary lp-cta-btn">
          {t(content, "finalCta.ctaLabel", locale)}
        </StartProjectTrigger>
      </Container>
    </section>
  );
}
