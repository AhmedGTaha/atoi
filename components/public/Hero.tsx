import { Container } from "@/components/ui/Container";
import { StartProjectTrigger } from "./StartProjectTrigger";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Link from "next/link";

export function Hero({ locale, content }: { locale: Locale; content: WebsiteContentMap }) {
  return (
    <section id="home" className="scroll-mt-[76px] pb-16 pt-14 sm:pb-24 sm:pt-20">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-ink/70 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-blue-dark" aria-hidden="true" />
            {t(content, "hero.eyebrow", locale)}
          </p>

          <h1 className="mt-5 text-[clamp(2.25rem,8vw,4.2rem)] font-extrabold leading-[0.98] tracking-tight">
            {t(content, "hero.heading", locale)}
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/65">
            {t(content, "hero.body", locale)}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <StartProjectTrigger className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-dark px-7 text-base font-semibold text-white transition-colors hover:bg-blue-dark/90">
              {t(content, "hero.ctaPrimary", locale)}
            </StartProjectTrigger>
            <Link
              href="/#work"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 px-7 text-base font-semibold text-ink transition-colors hover:border-black/30"
            >
              {t(content, "hero.ctaSecondary", locale)}
            </Link>
          </div>
        </div>

        <HeroVisual locale={locale} />
      </Container>
    </section>
  );
}

function HeroVisual({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const clearWord = locale === "ar" ? "واضح" : "clear";
  const progressWord = locale === "ar" ? "التقدم." : "progress.";

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-ink sm:aspect-[16/11]"
      aria-hidden="true"
    >
      <div className="absolute -end-10 -top-10 h-56 w-56 rounded-full border-[28px] border-blue-light/90 sm:h-72 sm:w-72" />
      <div className="absolute bottom-[-15%] start-[8%] h-[70%] w-[38%] rounded-t-[999px] bg-blue-dark" />

      <p className="absolute bottom-6 start-6 text-4xl font-extrabold leading-[0.95] text-cream sm:text-5xl">
        {clearWord}
        <br />
        {progressWord}
      </p>

      <div className="absolute end-5 top-5 max-w-[46%] text-end text-[11px] font-bold uppercase leading-snug tracking-wide text-cream/90 sm:text-xs">
        {locale === "ar" ? "برمجيات أعمال، بلا غموض" : "Business software, without the mystery"}
      </div>

      <div className="absolute inset-x-5 top-1/2 -translate-y-1/2 rounded-2xl bg-cream p-4 shadow-xl sm:inset-x-auto sm:end-6 sm:w-[62%] sm:max-w-[280px] sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-blue-dark">Project Pulse</p>
          <span className="rounded-full bg-blue-light px-2.5 py-1 text-[11px] font-bold text-ink">
            {locale === "ar" ? "قيد التنفيذ" : "In progress"}
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/10">
          <div className="h-full w-[62%] rounded-full bg-blue-dark" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="h-9 rounded-lg bg-blue-light" />
          <div className="h-9 rounded-lg bg-blue-dark" />
          <div className="h-9 rounded-lg bg-ink" />
        </div>
      </div>
      <span className="sr-only">{dict.nav.home}</span>
    </div>
  );
}
