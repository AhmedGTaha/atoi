import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

export function About({ locale, content }: { locale: Locale; content: WebsiteContentMap }) {
  return (
    <section id="about" className="public-section about-section">
      <Container className="grid gap-8 md:grid-cols-2">
        <h2 className="text-[clamp(2rem,5.5vw,3.25rem)] font-semibold leading-[1.05] tracking-normal">
          {t(content, "about.heading", locale)}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-cream/80">{t(content, "about.body", locale)}</p>
      </Container>
    </section>
  );
}
