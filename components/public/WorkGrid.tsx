"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/locale";
import { localize } from "@/lib/i18n/locale";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { WorkDetailModal } from "./WorkDetailModal";

const INITIAL_COUNT = 4;

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
  const [selected, setSelected] = useState<PortfolioProjectWithImages | null>(
    null,
  );

  const visible = useMemo(
    () => (expanded ? projects : projects.slice(0, INITIAL_COUNT)),
    [expanded, projects],
  );

  return (
    <>
      <div className="work-grid">
        {visible.map((project) => {
          const mainImage =
            project.images.find((img) => img.isMain) ?? project.images[0];

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelected(project)}
              className="work-item group"
            >
              <div>
                {project.category && (
                  <p className="section-marker mb-4">{project.category}</p>
                )}
                <h3 className="work-title">
                  {locale === "ar" ? project.titleAr : project.titleEn}
                </h3>
                <p className="mt-4 text-muted">
                  {locale === "ar"
                    ? project.descriptionAr
                    : project.descriptionEn}
                </p>
                <span className="mt-6 inline-flex items-center gap-4 text-blue-dark text-sm">
                  {locale === "ar" ? "تفاصيل المشروع" : "View project"}
                  <ArrowIcon />
                </span>
              </div>
              <div className="work-image">
                {mainImage ? (
                  <Image
                    src={mainImage.publicUrl}
                    alt={
                      localize(locale, {
                        valueEn: mainImage.altEn ?? "",
                        valueAr: mainImage.altAr ?? "",
                      }) ||
                      (locale === "ar" ? project.titleAr : project.titleEn)
                    }
                    fill
                    sizes="(min-width: 768px) 60vw, 90vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center section-marker text-ink">
                    {locale === "ar"
                      ? "لا توجد صورة للمشروع"
                      : "Project image unavailable"}
                  </span>
                )}
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
            className="text-sm font-semibold underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
          >
            {expanded ? dict.work.showLess : seeAllLabel}
          </button>
        </div>
      )}

      <WorkDetailModal
        project={selected}
        locale={locale}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="rtl:-scale-x-100"
    >
      <path
        d="M4 12L12 4M12 4H5M12 4V11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
