import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

const ITEMS = ["1", "2", "3", "4"] as const;

export function Services({ locale, content }: { locale: Locale; content: WebsiteContentMap }) {
  return (
    <section id="services" className="scroll-mt-[76px] bg-blue-light py-16 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 border-b border-ink/15 pb-8 sm:flex-row sm:items-end">
          <h2 className="text-[clamp(2rem,5.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-tight">
            {t(content, "services.heading", locale)}
          </h2>
          <p className="max-w-xs text-ink/70 sm:text-end">{t(content, "services.body", locale)}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {ITEMS.map((n, index) => (
            <div
              key={n}
              className={`border-b border-ink/15 py-8 pe-0 sm:pe-10 ${
                index % 2 === 0 ? "sm:border-e sm:pe-10" : "sm:ps-10"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-sm text-ink/60">{`0${n}`}</span>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/25"
                  aria-hidden="true"
                >
                  <ArrowIcon />
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-bold sm:text-[1.7rem]">
                {t(content, `services.item${n}.name`, locale)}
              </h3>
              <p className="mt-2 max-w-sm text-ink/70">
                {t(content, `services.item${n}.description`, locale)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rtl:-scale-x-100">
      <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
