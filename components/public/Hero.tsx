import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { StartProjectTrigger } from "./StartProjectTrigger";
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
  const heading = t(content, "hero.heading", locale);
  const softwareMatch = heading.match(/software\.?/i);

  return (
    <section id="home" className="hero">
      <Container className="hero-grid">
        <div>
          <p className="terminal-prompt">
            {t(content, "hero.eyebrow", locale)}
          </p>
          <h1 className="hero-title">
            {softwareMatch ? (
              <>
                {heading.slice(0, softwareMatch.index)}
                <span className="text-accent">{softwareMatch[0]}</span>
                {heading.slice(
                  (softwareMatch.index ?? 0) + softwareMatch[0].length,
                )}
              </>
            ) : (
              heading
            )}
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted">
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
        </div>
        <div className="hero-code" dir="ltr">
          <div className="code-window">
            <div className="code-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <span className="code-filename">inquiry.json</span>
            </div>
            <pre className="code-body">
              <code>
                <span className="tok-p">{"{"}</span>
                {"\n  "}
                <span className="tok-k">&quot;business&quot;</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-s">&quot;your shop&quot;</span>
                <span className="tok-p">,</span>
                {"\n  "}
                <span className="tok-k">&quot;need&quot;</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-s">&quot;a website that sells&quot;</span>
                <span className="tok-p">,</span>
                {"\n  "}
                <span className="tok-k">&quot;reply_in&quot;</span>
                <span className="tok-p">:</span>{" "}
                <span className="tok-s">&quot;one working day&quot;</span>
                {"\n"}
                <span className="tok-p">{"}"}</span>
              </code>
            </pre>
          </div>
          <figure className="hero-photo">
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop"
              alt={
                locale === "ar"
                  ? "اجتماع عمل مع عميل"
                  : "A working session with a client"
              }
              width={1200}
              height={800}
            />
          </figure>
        </div>
      </Container>
      <Container>
        <figure className="hero-media">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1800&auto=format&fit=crop"
            alt={
              locale === "ar"
                ? "فريق أتوي يعمل مع عميل"
                : "The ATOI team at work with a client"
            }
            width={1800}
            height={900}
            priority
          />
          <figcaption>
            {locale === "ar"
              ? "صورة مؤقتة — فريق يعمل مع عميل"
              : "Temporary photo — a team working with a client"}
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
