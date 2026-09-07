import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { StartProjectTrigger } from "./StartProjectTrigger";
import { HeroActivityPanel } from "./HeroActivityPanel";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";

export function Hero({
  locale,
  content,
}: {
  locale: Locale;
  content: WebsiteContentMap;
}) {
  return (
    <section id="home" className="hero">
      <Container className="hero-grid">
        <div>
          <p className="terminal-prompt" dir="ltr">
            <span>atoi</span>
            <span className="text-faint">@manama:~$</span> build --for you
            <span className="cursor" aria-hidden="true" />
          </p>
          <h1 className="hero-title">
            {t(content, "hero.heading", locale) ===
            "Give us the problem. We ship the software." ? (
              <>
                <span className="block">Give us the problem.</span>
                <span className="block">We ship the</span>
                <span className="block text-accent">software.</span>
              </>
            ) : (
              t(content, "hero.heading", locale)
                .split(/(software\.?)/i)
                .map((part, i) =>
                  /software/i.test(part) ? (
                    <span className="text-accent" key={i}>
                      {part}
                    </span>
                  ) : (
                    part
                  ),
                )
            )}
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-foreground/80">
            {t(content, "hero.body", locale)}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <StartProjectTrigger className="btn btn-primary">
              {t(content, "hero.ctaPrimary", locale)}
            </StartProjectTrigger>
            <Link href="/#work" className="btn btn-secondary">
              {t(content, "hero.ctaSecondary", locale)}
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted font-display">
            {t(content, "hero.eyebrow", locale)}
          </p>
        </div>
        <Panel className="studio-overview">
          <HeroActivityPanel locale={locale} />
        </Panel>
      </Container>
    </section>
  );
}
