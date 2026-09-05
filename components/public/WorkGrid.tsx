"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/locale";
import { localize } from "@/lib/i18n/locale";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { WorkDetailModal } from "./WorkDetailModal";

const INITIAL_COUNT = 4;
const CARD_TINTS = ["bg-blue-dark", "bg-blue-light"] as const;

export function WorkGrid({
  projects,
  locale,
  seeAllLabel,
}: {
  projects: PortfolioProjectWithImages[];
  locale: Locale;
  seeAllLabel: string;
}) {
  const dict = getDictionary(locale);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<PortfolioProjectWithImages | null>(null);

  const visible = useMemo(
    () => (expanded ? projects : projects.slice(0, INITIAL_COUNT)),
    [expanded, projects]
  );

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {visible.map((project, index) => {
          const mainImage = project.images.find((img) => img.isMain) ?? project.images[0];
          const tint = CARD_TINTS[index % 2]!;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelected(project)}
              className={`group relative flex aspect-[4/3] flex-col overflow-hidden rounded-[1.75rem] p-6 text-start ${
                project.featured ? tint : "bg-blue-dark/70"
              } sm:p-7`}
            >
              {project.category && (
                <span className="text-xs font-bold uppercase tracking-wider text-cream/90">
                  {project.category}
                </span>
              )}

              {mainImage ? (
                <div className="relative mt-4 flex-1 overflow-hidden rounded-2xl bg-cream">
                  <Image
                    src={mainImage.publicUrl}
                    alt={localize(locale, { valueEn: mainImage.altEn ?? "", valueAr: mainImage.altAr ?? "" }) || (locale === "ar" ? project.titleAr : project.titleEn)}
                    fill
                    sizes="(min-width: 640px) 45vw, 90vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="relative mt-4 flex-1 overflow-hidden rounded-2xl">
                  <span className="absolute -bottom-10 -end-10 h-40 w-40 rounded-full border-[22px] border-ink/25" aria-hidden="true" />
                </div>
              )}

              <div className="mt-4 flex items-end justify-between">
                <span className="text-xl font-bold text-cream sm:text-2xl">
                  {locale === "ar" ? project.titleAr : project.titleEn}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-ink">
                  <ArrowIcon />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {projects.length > INITIAL_COUNT && (
        <div className="mt-8 text-end">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-sm font-semibold underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
          >
            {expanded ? dict.work.showLess : seeAllLabel}
          </button>
        </div>
      )}

      <WorkDetailModal project={selected} locale={locale} onClose={() => setSelected(null)} />
    </>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="rtl:-scale-x-100">
      <path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
