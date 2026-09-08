import { Container } from "@/components/ui/Container";
import { StartProjectTrigger } from "./StartProjectTrigger";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";
import { MotionReveal } from "./MotionReveal";

export function FinalCta({
  locale,
  content,
  companyEmail,
}: {
  locale: Locale;
  content: WebsiteContentMap;
  companyEmail: string;
}) {
  return (
    <section
      id="contact"
      className="public-section contact-section motion-section"
    >
      <Container className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <MotionReveal
            as="p"
            className="section-marker section-marker-reveal mb-5"
          >
            [04] {t(content, "finalCta.eyebrow", locale)}
          </MotionReveal>
          <MotionReveal as="h2" className="max-w-[22ch]" delay={70}>
            {t(content, "finalCta.heading", locale)}
          </MotionReveal>
        </div>
        <MotionReveal className="flex flex-wrap items-center gap-4" delay={145}>
          <StartProjectTrigger className="btn btn-primary final-cta-button">
            {t(content, "finalCta.ctaLabel", locale)}
          </StartProjectTrigger>
          <a
            href={`mailto:${companyEmail}`}
            className="text-sm text-muted hover:text-foreground"
          >
            {locale === "ar" ? "أو راسلنا على" : "or email"}{" "}
            <bdi dir="ltr">{companyEmail}</bdi>
          </a>
        </MotionReveal>
      </Container>
    </section>
  );
}
