"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
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
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<PortfolioProjectWithImages | null>(
    null,
  );

  const visible = projects.slice(0, INITIAL_COUNT);

  return (
    <>
      <div className="work-grid">
        {visible.map((project, index) => (
          <WorkCard
            key={project.id}
            project={project}
            locale={locale}
            dict={dict}
            index={index}
            onOpen={() => setSelected(project)}
          />
        ))}
      </div>

      {projects.length > 0 && (
        <div className="mt-8 text-end">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="work-cta"
          >
            {seeAllLabel}
            <ArrowIcon />
          </button>
        </div>
      )}

      <AllProjectsModal
        isOpen={showAll}
        projects={projects}
        locale={locale}
        onClose={() => setShowAll(false)}
        onOpenProject={(project) => {
          setShowAll(false);
          setSelected(project);
        }}
      />

      <WorkDetailModal
        project={selected}
        locale={locale}
        onClose={() => setSelected(null)}
      />
    </>
  );
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
  const coverIndex = Math.max(0, project.images.findIndex((img) => img.isMain));
  const [imageIndex, setImageIndex] = useState(coverIndex);
  const image = project.images[imageIndex];
  const url = displayUrl(project.liveUrl);

  return (
    <figure className="work-figure">
      {url && (
        <div className="work-browserbar">
          <span>{url}</span>
        </div>
      )}
      <div className="work-image" style={{ aspectRatio: aspect }}>
        {image ? (
          <Image
            src={image.publicUrl}
            alt={
              localize(locale, {
                valueEn: image.altEn ?? "",
                valueAr: image.altAr ?? "",
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
        {project.images.length > 1 && (
          <>
            <button type="button" aria-label="Previous image" onClick={() => setImageIndex((i) => (i - 1 + project.images.length) % project.images.length)} className="work-image-control start-2">‹</button>
            <button type="button" aria-label="Next image" onClick={() => setImageIndex((i) => (i + 1) % project.images.length)} className="work-image-control end-2">›</button>
            <div className="work-image-pagination" aria-label={`Image ${imageIndex + 1} of ${project.images.length}`}>
              <span>{imageIndex + 1} / {project.images.length}</span>
              {project.images.map((item, index) => <button key={item.id} type="button" aria-label={`Show image ${index + 1}`} aria-current={index === imageIndex} onClick={() => setImageIndex(index)} className="work-image-dot" />)}
            </div>
          </>
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

function WorkCard({
  project,
  locale,
  dict,
  onOpen,
  index,
}: {
  project: PortfolioProjectWithImages;
  locale: Locale;
  dict: ReturnType<typeof getDictionary>;
  onOpen: () => void;
  index: number;
}) {
  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const description =
    locale === "ar" ? project.descriptionAr : project.descriptionEn;

  return (
    <article className="work-card">
      <WorkFigure project={project} locale={locale} aspect="16/10" />
      <div className="mt-4">
        <h3 className="work-title">{title}</h3>
        <p className="work-desc mt-2">{description}</p>
        <WorkMeta project={project} locale={locale} />
        <div className="flex items-center justify-between border-t border-rule pt-4">
          <WorkCta label={dict.work.caseStudy} onOpen={onOpen} />
          <span className="section-marker">[ {String(index + 1).padStart(2, "0")} ]</span>
        </div>
      </div>
    </article>
  );
}

function AllProjectsModal({ isOpen, projects, locale, onClose, onOpenProject }: { isOpen: boolean; projects: PortfolioProjectWithImages[]; locale: Locale; onClose: () => void; onOpenProject: (project: PortfolioProjectWithImages) => void }) {
  return <Modal isOpen={isOpen} onClose={onClose} titleId="all-projects-title" className="max-w-6xl">
    <div className="p-6 sm:p-8"><button type="button" onClick={onClose} aria-label="Close" className="icon-button absolute end-4 top-3">×</button><p className="section-marker">[ all ]</p><h2 id="all-projects-title" className="mt-2 text-3xl">{locale === "ar" ? "كل المشاريع" : "All projects"}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <button key={project.id} type="button" onClick={() => onOpenProject(project)} className="work-card text-start"><WorkFigure project={project} locale={locale} aspect="16/10" /><span className="mt-3 block font-display text-lg">{locale === "ar" ? project.titleAr : project.titleEn}</span></button>)}</div></div>
  </Modal>;
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
