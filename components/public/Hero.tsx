import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { StartProjectTrigger } from "./StartProjectTrigger";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";
import { HeroDepth, MotionReveal } from "./MotionReveal";

export function Hero({
  locale,
  content,
  previewMode = false,
}: {
  locale: Locale;
  content: WebsiteContentMap;
  previewMode?: boolean;
}) {
  const heading = t(content, "hero.heading", locale);
  const heroLines =
    heading === "Give us the problem. We ship the software."
      ? ["Give us the", "problem.", "We ship the", "software."]
      : heading
          .split(/(?<=[.!؟])\s+/)
          .map((line) => line.trim())
          .filter(Boolean);

  return (
    <section id="home" className="hero">
      <HeroDepth>
        <Container className="hero-grid">
          <h1 className="hero-title">
            {heroLines.map((line, index) => (
              <MotionReveal
                key={`${line}-${index}`}
                as="span"
                className={`hero-line ${/software\.?$|البرمجي\.?$/i.test(line) ? "text-accent" : ""}`}
                delay={index * 75}
                immediate
              >
                {line}
              </MotionReveal>
            ))}
          </h1>
          <MotionReveal
            as="p"
            className="hero-subtitle mt-8 max-w-lg text-lg leading-relaxed text-foreground/80"
            delay={310}
            immediate
          >
            {t(content, "hero.body", locale)}
          </MotionReveal>
          <MotionReveal
            className="mt-9 flex flex-wrap justify-center gap-3"
            delay={390}
            immediate
          >
            <StartProjectTrigger className="btn btn-primary">
              {t(content, "hero.ctaPrimary", locale)}
            </StartProjectTrigger>
            <Link
              href={previewMode ? "#work" : "/#work"}
              className="btn btn-secondary"
            >
              {t(content, "hero.ctaSecondary", locale)}
            </Link>
          </MotionReveal>
          <MotionReveal
            as="p"
            className="mt-6 text-xs text-muted font-display"
            delay={500}
            immediate
          >
            {t(content, "hero.eyebrow", locale)}
          </MotionReveal>
        </Container>
      </HeroDepth>
    </section>
  );
}
