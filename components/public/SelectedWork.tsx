import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { WorkGrid } from "./WorkGrid";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";
import { MotionReveal } from "./MotionReveal";

export function SelectedWork({
  locale,
  content,
  projects,
}: {
  locale: Locale;
  content: WebsiteContentMap;
  projects: PortfolioProjectWithImages[];
}) {
  const dict = getDictionary(locale);

  return (
    <section id="work" className="public-section work-section motion-section">
      <Container className="work-container">
        <MotionReveal
          as="p"
          className="section-marker section-marker-reveal selected-work-marker"
        >
          [ 02 ]
        </MotionReveal>
        <MotionReveal className="selected-work-heading" delay={70}>
          <div>
            <h2>{t(content, "work.heading", locale)}</h2>
            <p>{t(content, "work.intro", locale)}</p>
          </div>
        </MotionReveal>

        {projects.length === 0 ? (
          <p className="mt-10 empty-state">{dict.work.empty}</p>
        ) : (
          <WorkGrid
            projects={projects}
            locale={locale}
            seeAllLabel={t(content, "work.seeAllLabel", locale)}
          />
        )}
      </Container>
    </section>
  );
}
