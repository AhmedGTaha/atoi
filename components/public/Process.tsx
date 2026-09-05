import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

const STEPS = ["1", "2", "3"] as const;

export function Process({ locale, content }: { locale: Locale; content: WebsiteContentMap }) {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-8">
        <h2 className="text-[clamp(2rem,5.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-tight">
          {t(content, "process.heading", locale)}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((n) => (
            <div key={n} className="rounded-3xl bg-cream-dim/70 p-6">
              <span className="font-mono text-sm text-blue-dark">{`0${n}`}</span>
              <h3 className="mt-8 text-xl font-bold">{t(content, `process.step${n}.name`, locale)}</h3>
              <p className="mt-3 text-ink/65">{t(content, `process.step${n}.description`, locale)}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
