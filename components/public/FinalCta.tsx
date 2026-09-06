import { Container } from "@/components/ui/Container";
import { StartProjectModal } from "./StartProjectModal";
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
    <section id="contact" className="public-section">
      <Container className="grid items-start gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <p className="section-marker mb-5">
            {t(content, "finalCta.eyebrow", locale)}
          </p>
          <h2>{t(content, "finalCta.heading", locale)}</h2>
          <p className="mt-6 text-lg text-muted">
            {t(content, "finalCta.body", locale)}
          </p>
          <p className="mt-8 border-t pt-5 section-marker">
            {t(content, "finalCta.ctaLabel", locale)}
          </p>
        </div>
        <StartProjectModal locale={locale} inline />
      </Container>
    </section>
  );
}
