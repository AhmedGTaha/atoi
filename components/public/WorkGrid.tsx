"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/locale";
import { localize } from "@/lib/i18n/locale";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { WorkDetailModal } from "./WorkDetailModal";

// ATOI Studio.dc.html shows exactly three case studies before "see all".
const INITIAL_COUNT = 3;

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
        {visible.map((project, index) =>
          index < 2 ? (
            <WorkSplitArticle
              key={project.id}
              project={project}
              locale={locale}
              dict={dict}
              onOpen={() => setSelected(project)}
            />
          ) : (
            <WorkFullArticle
              key={project.id}
              project={project}
              locale={locale}
              dict={dict}
              onOpen={() => setSelected(project)}
            />
          ),
        )}
      </div>

      {projects.length > INITIAL_COUNT && (
        <div className="mt-8 text-end">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-sm font-semibold underline decoration-foreground/40 underline-offset-4 hover:decoration-foreground"
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

/** work/<slug>, always derived from the English title for a stable eyebrow. */
function slugFor(project: PortfolioProjectWithImages): string {
  return project.titleEn
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** hostname + path shown in the browser-bar figure header, e.g. "app.ledgerline.io". */
function displayUrl(liveUrl: string | null): string | null {
  if (!liveUrl) return null;
  try {
    const url = new URL(liveUrl);
    const path = url.pathname === "/" ? "" : url.pathname;
    return `${url.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return liveUrl;
  }
}

function WorkFigure({
  project,
  locale,
  aspect,
}: {
  project: PortfolioProjectWithImages;
  locale: Locale;
  aspect: "16/10" | "2/1";
}) {
  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const mainImage =
    project.images.find((img) => img.isMain) ?? project.images[0];
  const url = displayUrl(project.liveUrl);

  return (
    <figure className="work-figure">
      {url && (
        <div className="work-browserbar">
          <span>{url}</span>
        </div>
      )}
      <div className="work-image" style={{ aspectRatio: aspect }}>
        {mainImage ? (
          <Image
            src={mainImage.publicUrl}
            alt={
              localize(locale, {
                valueEn: mainImage.altEn ?? "",
                valueAr: mainImage.altAr ?? "",
              }) || title
            }
            fill
            sizes="(min-width: 768px) 60vw, 90vw"
            className="object-cover object-top"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center section-marker text-foreground">
            {locale === "ar"
              ? "لا توجد صورة للمشروع"
              : "Project image unavailable"}
          </span>
        )}
      </div>
    </figure>
  );
}

function WorkMeta({
  project,
  locale,
}: {
  project: PortfolioProjectWithImages;
  locale: Locale;
}) {
  const result = locale === "ar" ? project.resultAr : project.resultEn;
  if (!project.category && !result) return null;
  return (
    <div className="work-meta">
      {project.category && <div>{project.category}</div>}
      {result && <div className="work-result">{result}</div>}
    </div>
  );
}

function WorkCta({
  label,
  onOpen,
}: {
  label: string;
  onOpen: () => void;
}) {
  return (
    <button type="button" onClick={onOpen} className="work-cta">
      {label}
      <ArrowIcon />
    </button>
  );
}

function WorkSplitArticle({
  project,
  locale,
  dict,
  onOpen,
}: {
  project: PortfolioProjectWithImages;
  locale: Locale;
  dict: ReturnType<typeof getDictionary>;
  onOpen: () => void;
}) {
  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const description =
    locale === "ar" ? project.descriptionAr : project.descriptionEn;

  return (
    <article className="work-item">
      <div>
        <p className="work-eyebrow">work/{slugFor(project)}</p>
        <h3 className="work-title">{title}</h3>
        <p className="work-desc">{description}</p>
        <WorkMeta project={project} locale={locale} />
        <WorkCta label={dict.work.caseStudy} onOpen={onOpen} />
      </div>
      <WorkFigure project={project} locale={locale} aspect="16/10" />
    </article>
  );
}

function WorkFullArticle({
  project,
  locale,
  dict,
  onOpen,
}: {
  project: PortfolioProjectWithImages;
  locale: Locale;
  dict: ReturnType<typeof getDictionary>;
  onOpen: () => void;
}) {
  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const description =
    locale === "ar" ? project.descriptionAr : project.descriptionEn;

  return (
    <article className="work-full">
      <div className="work-full-head">
        <div>
          <p className="work-eyebrow">work/{slugFor(project)}</p>
          <h3 className="work-full-title">{title}</h3>
        </div>
        <WorkCta label={dict.work.caseStudy} onOpen={onOpen} />
      </div>
      <div className="work-full-figure">
        <WorkFigure project={project} locale={locale} aspect="2/1" />
      </div>
      <div className="work-full-footer">
        <p className="work-desc" style={{ margin: 0 }}>
          {description}
        </p>
        <WorkMeta project={project} locale={locale} />
      </div>
    </article>
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
