"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import type { Locale } from "@/lib/i18n/locale";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";
import { getDictionary } from "@/lib/i18n/dictionaries";

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
  const [imageIndex, setImageIndex] = useState(0);
  const projectId = project?.id;
  const coverIndex = Math.max(0, project?.images.findIndex((image) => image.isMain) ?? 0);
  useEffect(() => {
    setImageIndex(coverIndex);
  }, [projectId, coverIndex]);

  if (!project) return null;

  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const description =
    locale === "ar" ? project.descriptionAr : project.descriptionEn;
  const problem = locale === "ar" ? project.problemAr : project.problemEn;
  const built = locale === "ar" ? project.builtAr : project.builtEn;
  const result = locale === "ar" ? project.resultAr : project.resultEn;
  const image = project.images[Math.min(imageIndex, Math.max(0, project.images.length - 1))];

  return (
    <Modal
      isOpen={!!project}
      onClose={onClose}
      titleId={titleId}
      className="max-w-6xl"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.modal.close}
          className="icon-button absolute z-20 end-4 top-3"
        >
          <CloseIcon />
        </button>

        {image && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
            <Image
              src={image.publicUrl}
              alt={title}
              fill
              sizes="(min-width: 768px) 680px, 90vw"
              className="object-cover"
            />
            {project.images.length > 1 && <><button type="button" aria-label="Previous image" onClick={() => setImageIndex((i) => (i - 1 + project.images.length) % project.images.length)} className="work-image-control start-3">‹</button><button type="button" aria-label="Next image" onClick={() => setImageIndex((i) => (i + 1) % project.images.length)} className="work-image-control end-3">›</button></>}
          </div>
        )}

        {project.category && (
          <p className="mt-6 text-xs font-bold tracking-wider text-accent">
            {project.category}
          </p>
        )}
        <h2
          id={titleId}
          className="mt-2 pe-10 text-3xl font-semibold tracking-normal"
        >
          {title}
        </h2>
        <p className="mt-3 text-foreground/70">{description}</p>
        {project.clientName && <p className="mt-4 font-display text-xs text-muted">{project.clientName}</p>}

        {project.images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {project.images.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setImageIndex(index)}
                aria-current={imageIndex === index}
                className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden border ${imageIndex === index ? "border-accent" : "border-rule"}`}
              >
                <Image
                  src={img.publicUrl}
                  alt={locale === "ar" ? (img.altAr ?? "") : (img.altEn ?? "")}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {problem && (
            <DetailBlock
              label={locale === "ar" ? "المشكلة" : "Problem"}
              text={problem}
            />
          )}
          {built && (
            <DetailBlock
              label={locale === "ar" ? "ما قمنا ببنائه" : "What we built"}
              text={built}
            />
          )}
          {result && (
            <DetailBlock
              label={locale === "ar" ? "النتيجة" : "Result"}
              text={result}
            />
          )}
        </div>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 btn btn-primary"
          >
            {dict.work.liveSite}
          </a>
        )}
      </div>
    </Modal>
  );
}

function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-surface/70 p-4">
      <p className="text-xs font-bold tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-sm text-foreground/80">{text}</p>
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
        d="M1 1L15 15M15 1L1 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
