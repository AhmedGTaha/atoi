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
    <section id="work" className="scroll-mt-[76px] bg-ink py-16 text-cream sm:py-24">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[clamp(2rem,6vw,3.25rem)] font-extrabold leading-[1.02] tracking-tight">
            {t(content, "work.heading", locale)}
          </h2>
        </div>

        {projects.length === 0 ? (
          <p className="mt-10 text-cream/60">{dict.work.empty}</p>
        ) : (
          <WorkGrid projects={projects} locale={locale} seeAllLabel={t(content, "work.seeAllLabel", locale)} />
        )}
      </Container>
    </section>
  );
}
