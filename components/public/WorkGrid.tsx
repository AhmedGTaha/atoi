"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import type { Locale } from "@/lib/i18n/locale";
import { localize } from "@/lib/i18n/locale";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ProjectGallery } from "./ProjectGallery";
import { WorkDetailModal } from "./WorkDetailModal";
import { MotionReveal } from "./MotionReveal";

const FEATURED_COUNT = 3;

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
  const featured = projects.slice(0, FEATURED_COUNT);

  return (
    <>
      <div className="work-grid">
        {featured.map((project, index) => (
          <MotionReveal
            key={project.id}
            className={`motion-work-card motion-featured-work motion-featured-work-${index + 1}`}
            delay={120 + index * 110}
          >
            <WorkCard
              project={project}
              locale={locale}
              number={index + 1}
              actionLabel={dict.work.caseStudy}
              onOpen={() => setSelected(project)}
            />
          </MotionReveal>
        ))}
      </div>
      <div className="selected-work-footer">
        <span>{dict.portfolio.footerTagline}</span>
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="work-cta"
        >
          {seeAllLabel} <ArrowIcon />
        </button>
      </div>
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

function localizedProject(project: PortfolioProjectWithImages, locale: Locale) {
  return {
    title:
      locale === "ar" ? project.titleAr || project.titleEn : project.titleEn,
    description:
      locale === "ar"
        ? project.descriptionAr || project.descriptionEn
        : project.descriptionEn,
  };
}

function WorkCard({
  project,
  locale,
  number,
  actionLabel,
  onOpen,
}: {
  project: PortfolioProjectWithImages;
  locale: Locale;
  number: number;
  actionLabel: string;
  onOpen: () => void;
}) {
  const { title, description } = localizedProject(project, locale);
  const category = project.category
    ? localize(locale, {
        valueEn: project.category,
        valueAr: project.categoryAr ?? "",
      })
    : null;
  const metadata = [category, project.clientName].filter(Boolean);
  const built = localize(locale, {
    valueEn: project.builtEn ?? "",
    valueAr: project.builtAr ?? "",
  });
  const result = localize(locale, {
    valueEn: project.resultEn ?? "",
    valueAr: project.resultAr ?? "",
  });
  const detail =
    built || metadata.join(" · ") || project.technologies.join(" · ");
  const projectSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const frameLabel = project.liveUrl
    ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : `work/${projectSlug || `project-${number}`}`;

  if (number === FEATURED_COUNT) {
    return (
      <article className="work-card work-card-wide">
        <div className="work-wide-heading">
          <div>
            <p className="work-card-kicker">{frameLabel}</p>
            <h3 className="work-title">{title}</h3>
          </div>
          <button
            type="button"
            aria-label={`${actionLabel}: ${title}`}
            onClick={onOpen}
            className="work-cta"
          >
            {actionLabel} <ArrowIcon />
          </button>
        </div>
        <ProjectGallery
          images={project.images}
          locale={locale}
          title={title}
          frameLabel={frameLabel}
          mode="featured"
          className="work-card-media"
        />
        <div className="work-wide-details">
          <p className="work-desc">{description}</p>
          {(detail || result) && (
            <p className="work-card-meta">
              {detail}
              {result && <span>{result}</span>}
            </p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="work-card">
      <div className="work-card-body">
        <p className="work-card-kicker">{frameLabel}</p>
        <h3 className="work-title">{title}</h3>
        <p className="work-desc">{description}</p>
        {(detail || result) && (
          <p className="work-card-meta">
            {detail}
            {result && <span>{result}</span>}
          </p>
        )}
        <div className="work-card-footer">
          <button
            type="button"
            aria-label={`${actionLabel}: ${title}`}
            onClick={onOpen}
            className="work-cta"
          >
            {actionLabel} <ArrowIcon />
          </button>
        </div>
      </div>
      <ProjectGallery
        images={project.images}
        locale={locale}
        title={title}
        frameLabel={frameLabel}
        mode="featured"
        className="work-card-media"
      />
    </article>
  );
}

function AllProjectsModal({
  isOpen,
  projects,
  locale,
  onClose,
  onOpenProject,
}: {
  isOpen: boolean;
  projects: PortfolioProjectWithImages[];
  locale: Locale;
  onClose: () => void;
  onOpenProject: (project: PortfolioProjectWithImages) => void;
}) {
  const dict = getDictionary(locale);
  const [category, setCategory] = useState("all");
  // Filtering stays keyed on the canonical (English) category value so
  // projects group correctly even when only some have an Arabic label;
  // categoryLabels supplies the localized text shown for each chip.
  const { categories, categoryLabels } = useMemo(() => {
    const labels = new Map<string, string>();
    for (const project of projects) {
      if (project.category && !labels.has(project.category)) {
        labels.set(
          project.category,
          localize(locale, {
            valueEn: project.category,
            valueAr: project.categoryAr ?? "",
          }),
        );
      }
    }
    return { categories: Array.from(labels.keys()), categoryLabels: labels };
  }, [projects, locale]);
  const filtered =
    category === "all"
      ? projects
      : projects.filter((project) => project.category === category);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="all-projects-title"
      className="all-projects-dialog max-w-6xl"
      overlayClassName="project-modal-overlay"
    >
      <div className="all-projects-modal">
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.portfolio.close}
          className="icon-button all-projects-close"
        >
          ×
        </button>
        <h2 id="all-projects-title">{dict.portfolio.allProjectsHeading}</h2>
        <p>{dict.portfolio.allProjectsIntro}</p>
        <div
          className="project-filters"
          role="group"
          aria-label={dict.portfolio.filterProjects}
        >
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            {dict.portfolio.allCategory}
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {categoryLabels.get(item) ?? item}
            </button>
          ))}
        </div>
        <div className="all-projects-grid">
          {filtered.map((project) => {
            const { title, description } = localizedProject(project, locale);
            const cover =
              project.images.find((image) => image.isMain) ?? project.images[0];
            return (
              <button
                key={project.id}
                type="button"
                className="all-project-card"
                onClick={() => onOpenProject(project)}
              >
                <span className="all-project-image">
                  {cover && (
                    <Image
                      src={cover.publicUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 18vw, 44vw"
                      className="object-cover object-top"
                    />
                  )}
                </span>
                <span className="all-project-copy">
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <ArrowIcon />
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

export function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="rtl:-scale-x-100"
    >
      <path
        d="M3 8h9M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
