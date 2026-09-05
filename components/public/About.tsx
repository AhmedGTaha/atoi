import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

export function About({ locale, content }: { locale: Locale; content: WebsiteContentMap }) {
  return (
    <section id="about" className="scroll-mt-[76px] py-16 sm:py-24">
      <Container className="max-w-3xl">
        <h2 className="text-[clamp(2rem,5.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight">
          {t(content, "about.heading", locale)}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-ink/70">{t(content, "about.body", locale)}</p>
      </Container>
    </section>
  );
}
