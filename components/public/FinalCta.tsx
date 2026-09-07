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
    <section id="contact" className="public-section contact-section contact-dark">
      <Container className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="section-marker mb-5">
            [04] {t(content, "finalCta.eyebrow", locale)}
          </p>
          <h2 className="max-w-[22ch]">
            {t(content, "finalCta.heading", locale)}
          </h2>
          <p className="mt-4 max-w-lg text-muted">
            {t(content, "finalCta.body", locale)}
          </p>
        </div>
        <StartProjectTrigger className="btn btn-primary">
          {t(content, "finalCta.ctaLabel", locale)}
        </StartProjectTrigger>
      </Container>
    </section>
  );
}
