import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BlueprintPanel } from "@/components/ui/BlueprintPanel";
import { StartProjectTrigger } from "./StartProjectTrigger";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

export function Hero({ locale, content }: { locale: Locale; content: WebsiteContentMap }) {
  return (
    <section id="home" className="hero">
      <Container className="hero-grid">
        <div>
          <p className="section-marker mb-5">{t(content, "hero.eyebrow", locale)}</p>
          <h1 className="hero-title">{t(content, "hero.heading", locale)}</h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink/80">{t(content, "hero.body", locale)}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <StartProjectTrigger className="btn btn-primary">{t(content, "hero.ctaPrimary", locale)}</StartProjectTrigger>
            <Link href="/#work" className="btn btn-secondary">{t(content, "hero.ctaSecondary", locale)}</Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5">
            {[1, 2, 3, 4].map((n) => <span key={n} className="section-marker text-muted">{t(content, `services.item${n}.name`, locale)}</span>)}
          </div>
        </div>
        <BlueprintPanel className="work-order">
          <div className="flex justify-between border-b p-4 section-marker">
            <span>{locale === "ar" ? "مسار العمل" : "Work order"}</span><span className="text-muted">ATOI / 01</span>
          </div>
          <div className="px-4 py-7">
            <p className="section-marker mb-4">{locale === "ar" ? "من الفكرة إلى التنفيذ" : "From brief to delivery"}</p>
            <p className="font-display text-3xl leading-tight">{t(content, "process.heading", locale)}</p>
          </div>
          {[1, 2, 3].map((n) => (
            <div className="work-order-row" key={n}>
              <span className="section-marker">0{n}</span>
              <div><h2 className="text-xl">{t(content, `process.step${n}.name`, locale)}</h2><p className="mt-2 text-sm text-muted">{t(content, `process.step${n}.description`, locale)}</p></div>
              <span aria-hidden="true" className="text-blue-dark">↗</span>
            </div>
          ))}
        </BlueprintPanel>
      </Container>
    </section>
  );
}
