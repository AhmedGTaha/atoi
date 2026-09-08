import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";
import { MotionReveal } from "./MotionReveal";

export function About({
  locale,
  content,
}: {
  locale: Locale;
  content: WebsiteContentMap;
}) {
  return (
    <section id="about" className="public-section about-section motion-section">
      <Container>
        <MotionReveal
          as="p"
          className="section-marker section-marker-reveal mb-6"
        >
          [03] how-we-work.md
        </MotionReveal>
        <div className="readme">
          <MotionReveal as="h3" delay={70}>
            # {t(content, "process.heading", locale)}
          </MotionReveal>
          {[1, 2, 3].map((n) => (
            <MotionReveal className="readme-row" key={n} delay={140 + n * 115}>
              <p>
                <span className="text-accent-foreground" aria-hidden="true">
                  →{" "}
                </span>
                {t(content, `process.step${n}.name`, locale)}
              </p>
              <p className="readme-row-description">
                {t(content, `process.step${n}.description`, locale)}
              </p>
            </MotionReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
