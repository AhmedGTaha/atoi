import { Container } from "@/components/ui/Container";
import { StartProjectTrigger } from "./StartProjectTrigger";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

export function FinalCta({ locale, content }: { locale: Locale; content: WebsiteContentMap }) {
  return (
    <section className="pb-16 pt-4 sm:pb-24">
      <Container>
        <div className="rounded-[2rem] bg-blue-dark px-6 py-14 text-cream sm:px-14 sm:py-20">
          <p className="text-xs font-bold tracking-[0.14em] text-cream/70 sm:text-sm">
            {t(content, "finalCta.eyebrow", locale)}
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight">
            {t(content, "finalCta.heading", locale)}
          </h2>
          <p className="mt-5 max-w-lg text-lg text-cream/85">{t(content, "finalCta.body", locale)}</p>

          <StartProjectTrigger className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-cream px-7 text-base font-semibold text-ink transition-colors hover:bg-cream-dim">
            {t(content, "finalCta.ctaLabel", locale)}
          </StartProjectTrigger>
        </div>
      </Container>
    </section>
  );
}
