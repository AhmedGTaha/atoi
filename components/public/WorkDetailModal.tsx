"use client";

import { useId } from "react";
import { Modal } from "@/components/ui/Modal";
import type { Locale } from "@/lib/i18n/locale";
import { localize } from "@/lib/i18n/locale";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ProjectGallery } from "./ProjectGallery";
import { ArrowIcon } from "./WorkGrid";

export function WorkDetailModal({
  project,
  locale,
  onClose,
}: {
  project: PortfolioProjectWithImages | null;
  locale: Locale;
  onClose: () => void;
}) {
  const titleId = useId();
  const dict = getDictionary(locale);
  if (!project) return null;

  const title =
    locale === "ar" ? project.titleAr || project.titleEn : project.titleEn;
  const description =
    locale === "ar"
      ? project.descriptionAr || project.descriptionEn
      : project.descriptionEn;
  const category = project.category
    ? localize(locale, {
        valueEn: project.category,
        valueAr: project.categoryAr ?? "",
      })
    : null;

  return (
    <Modal
      isOpen
      onClose={onClose}
      titleId={titleId}
      className="project-detail-dialog max-w-7xl"
      overlayClassName="project-modal-overlay"
    >
      <div className="project-detail-modal">
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.modal.close}
          className="icon-button project-detail-close"
        >
          <CloseIcon />
        </button>
        <div className="project-detail-lead">
          <div className="project-detail-title-row">
            <h2 id={titleId}>{title}</h2>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${dict.portfolio.openLiveSite}: ${title}`}
                className="project-external-link"
              >
                <ExternalIcon />
              </a>
            )}
          </div>
          <p>{description}</p>
          <ProjectGallery
            images={project.images}
            locale={locale}
            title={title}
            mode="detail"
          />
        </div>
        <aside className="project-detail-overview">
          <h3>{dict.portfolio.projectOverview}</h3>
          <dl>
            {category && (
              <Metadata label={dict.portfolio.category}>{category}</Metadata>
            )}
            {project.clientName && (
              <Metadata label={dict.portfolio.client}>
                {project.clientName}
              </Metadata>
            )}
            {project.technologies.length > 0 && (
              <Metadata label={dict.portfolio.technologies}>
                <ul className="project-tags">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </Metadata>
            )}
            {project.liveUrl && (
              <Metadata label={dict.portfolio.liveSite}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.liveUrl.replace(/^https?:\/\//, "")} <ExternalIcon />
                </a>
              </Metadata>
            )}
          </dl>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary project-live-cta"
            >
              {dict.work.liveSite} <ArrowIcon />
            </a>
          )}
        </aside>
      </div>
    </Modal>
  );
}

function Metadata({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.5 1.5 14.5 14.5M14.5 1.5 1.5 14.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8.5 2.5h5v5M13.25 2.75 7 9M6.5 3H3.75a1 1 0 0 0-1 1v8.25a1 1 0 0 0 1 1H12a1 1 0 0 0 1-1V9.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
