import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { WorkGrid } from "./WorkGrid";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";

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
    <section id="work" className="lp-section lp-alt">
      <Container>
        <p className="lp-kicker">
          {locale === "ar" ? "أعمال مختارة" : "Selected work"}
        </p>
        <div className="lp-split">
          <h2 className="lp-h2">{t(content, "work.heading", locale)}</h2>
        </div>

        {projects.length === 0 ? (
          <p className="lp-empty">{dict.work.empty}</p>
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
