"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import type { Locale } from "@/lib/i18n/locale";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ProjectGallery } from "./ProjectGallery";
import { WorkDetailModal } from "./WorkDetailModal";

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
      <div className="selected-work-actions">
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="work-cta"
        >
          {seeAllLabel} <ArrowIcon />
        </button>
      </div>
      <div className="work-grid">
        {featured.map((project, index) => (
          <WorkCard
            key={project.id}
            project={project}
            locale={locale}
            number={index + 1}
            actionLabel={dict.work.caseStudy}
            onOpen={() => setSelected(project)}
          />
        ))}
      </div>
      <div className="selected-work-footer">
        <span>
          {locale === "ar"
            ? "// المزيد قريباً. لنبدأ مشروعك التالي."
            : "// More to come. Let’s build yours next."}
        </span>
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
  return (
    <article className="work-card">
      <ProjectGallery images={project.images} locale={locale} title={title} />
      <div className="work-card-body">
        <h3 className="work-title">{title}</h3>
        <p className="work-desc">{description}</p>
        {project.technologies.length > 0 && (
          <ul
            className="project-tags"
            aria-label={locale === "ar" ? "التقنيات" : "Technologies"}
          >
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
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
          <span className="section-marker">
            [ {String(number).padStart(2, "0")} ]
          </span>
        </div>
      </div>
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
  const [category, setCategory] = useState("all");
  const categories = useMemo(
    () =>
      Array.from(
        new Set(projects.map((project) => project.category).filter(Boolean)),
      ) as string[],
    [projects],
  );
  const filtered =
    category === "all"
      ? projects
      : projects.filter((project) => project.category === category);
  const heading = locale === "ar" ? "كل المشاريع" : "All Projects";
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="all-projects-title"
      className="all-projects-dialog max-w-6xl"
    >
      <div className="all-projects-modal">
        <button
          type="button"
          onClick={onClose}
          aria-label={locale === "ar" ? "إغلاق" : "Close"}
          className="icon-button all-projects-close"
        >
          ×
        </button>
        <h2 id="all-projects-title">{heading}</h2>
        <p>
          {locale === "ar" ? "مجموعة من أعمالنا." : "A collection of our work."}
        </p>
        <div
          className="project-filters"
          role="group"
          aria-label={locale === "ar" ? "تصفية المشاريع" : "Filter projects"}
        >
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => setCategory("all")}
          >
            {locale === "ar" ? "الكل" : "All"}
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
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
