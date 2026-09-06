"use client";

import { useId } from "react";
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

  if (!project) return null;

  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const description =
    locale === "ar" ? project.descriptionAr : project.descriptionEn;
  const problem = locale === "ar" ? project.problemAr : project.problemEn;
  const built = locale === "ar" ? project.builtAr : project.builtEn;
  const result = locale === "ar" ? project.resultAr : project.resultEn;

  return (
    <Modal
      isOpen={!!project}
      onClose={onClose}
      titleId={titleId}
      className="max-w-[720px]"
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.modal.close}
          className="absolute z-20 end-5 top-5 flex h-11 w-11 items-center justify-center bg-ink text-cream hover:bg-blue-dark"
        >
          <CloseIcon />
        </button>

        {project.images[0] && (
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={project.images[0].publicUrl}
              alt={title}
              fill
              sizes="(min-width: 768px) 680px, 90vw"
              className="object-cover"
            />
          </div>
        )}

        {project.category && (
          <p className="mt-6 text-xs font-bold uppercase tracking-wider text-blue-dark">
            {project.category}
          </p>
        )}
        <h2
          id={titleId}
          className="mt-2 pe-10 text-3xl font-semibold tracking-normal"
        >
          {title}
        </h2>
        <p className="mt-3 text-ink/70">{description}</p>

        {project.images.length > 1 && (
          <div className="mt-6 grid grid-cols-3 gap-3">
            {project.images.slice(1).map((img) => (
              <div
                key={img.id}
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={img.publicUrl}
                  alt={locale === "ar" ? (img.altAr ?? "") : (img.altEn ?? "")}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
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
    <div className="bg-cream-dim/70 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm text-ink/80">{text}</p>
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
