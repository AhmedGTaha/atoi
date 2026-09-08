import { Container } from "@/components/ui/Container";
import { StartProjectTrigger } from "./StartProjectTrigger";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

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
    <section id="contact" className="public-section contact-section">
      <Container className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="section-marker mb-5">
            [04] {t(content, "finalCta.eyebrow", locale)}
          </p>
          <h2 className="max-w-[22ch]">
            {t(content, "finalCta.heading", locale)}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <StartProjectTrigger className="btn btn-primary">
            {t(content, "finalCta.ctaLabel", locale)}
          </StartProjectTrigger>
          <a href={`mailto:${companyEmail}`} className="text-sm text-muted hover:text-foreground">
            {locale === "ar" ? "أو راسلنا على" : "or email"}{" "}
            <bdi dir="ltr">{companyEmail}</bdi>
          </a>
        </div>
      </Container>
    </section>
  );
}
