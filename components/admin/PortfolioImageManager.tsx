"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { PortfolioImage } from "@prisma/client";
import {
  removePortfolioImageAction,
  reorderPortfolioImagesAction,
  setMainPortfolioImageAction,
  uploadPortfolioImageAction,
} from "@/app/actions/portfolioActions";
import { ProjectGallery } from "@/components/public/ProjectGallery";

const MAX_FILES = 10;
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function PortfolioImageManager({
  projectId,
  images,
}: {
  projectId: string;
  images: PortfolioImage[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [draggedId, setDraggedId] = useState<string>();

  const submitFiles = (files: FileList | File[]) => {
    const selected = Array.from(files);
    if (!selected.length) return;
    if (images.length + selected.length > MAX_FILES)
      return setError(
        `This project can contain a maximum of ${MAX_FILES} images.`,
      );
    if (selected.some((file) => !ACCEPTED_TYPES.has(file.type)))
      return setError("Only PNG, JPG and WebP images are allowed.");
    if (selected.some((file) => file.size > MAX_BYTES))
      return setError("Each image must be 5MB or smaller.");
    setError(undefined);
    const formData = new FormData();
    selected.forEach((file) => formData.append("image", file));
    startTransition(async () => {
      const state = await uploadPortfolioImageAction(projectId, {}, formData);
      setError(state.error);
      if (!state.error) router.refresh();
    });
  };

  const updateOrder = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const ordered = [...images];
    const from = ordered.findIndex((image) => image.id === sourceId);
    const to = ordered.findIndex((image) => image.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = ordered.splice(from, 1);
    if (!moved) return;
    ordered.splice(to, 0, moved);
    startTransition(async () => {
      await reorderPortfolioImagesAction(
        projectId,
        ordered.map((image) => image.id),
      );
      router.refresh();
    });
  };

  const removeImage = (imageId: string) =>
    startTransition(async () => {
      await removePortfolioImageAction(imageId);
      router.refresh();
    });
  const setCover = (imageId: string) =>
    startTransition(async () => {
      await setMainPortfolioImageAction(projectId, imageId);
      router.refresh();
    });

  return (
    <div className="portfolio-image-manager">
      <div className="portfolio-images-heading">
        <span>Project images</span>
        <span>
          {images.length}/{MAX_FILES}
        </span>
      </div>
      <div
        className="portfolio-dropzone"
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          submitFiles(event.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="sr-only"
          onChange={(event) =>
            event.target.files && submitFiles(event.target.files)
          }
        />
        <UploadIcon />
        <strong>
          {isPending ? "Uploading images…" : "Drag and drop images here"}
        </strong>
        <span>or click to browse</span>
        <small>PNG, JPG, WebP · Max 5MB each</small>
      </div>
      {error && (
        <p role="alert" className="portfolio-upload-error">
          {error}
        </p>
      )}
      {images.length > 0 && (
        <div className="portfolio-image-list">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="portfolio-image-row"
              draggable={!isPending}
              onDragStart={() => setDraggedId(image.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggedId) updateOrder(draggedId, image.id);
                setDraggedId(undefined);
              }}
            >
              <div className="portfolio-image-thumbnail">
                <Image
                  src={image.publicUrl}
                  alt=""
                  fill
                  sizes="76px"
                  className="object-cover"
                />
              </div>
              <div className="portfolio-image-file">
                <strong>{image.fileName || `Image ${index + 1}`}</strong>
                <span>
                  {image.fileSize
                    ? formatBytes(image.fileSize)
                    : `Image ${index + 1}`}
                </span>
              </div>
              {image.isMain ? (
                <span className="portfolio-cover-badge">Cover</span>
              ) : (
                <button
                  type="button"
                  disabled={isPending}
                  className="portfolio-text-action"
                  onClick={() => setCover(image.id)}
                >
                  Set cover
                </button>
              )}
              <span className="portfolio-drag-handle" aria-hidden="true">
                ⠿
              </span>
              <button
                type="button"
                disabled={isPending}
                aria-label={`Delete ${image.fileName || `image ${index + 1}`}`}
                className="portfolio-delete-image"
                onClick={() => removeImage(image.id)}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="portfolio-image-preview">
        <p>Image preview (how it appears)</p>
        <ProjectGallery
          images={images}
          locale="en"
          title="Project image"
          mode="preview"
        />
      </div>
    </div>
  );
}

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(bytes > 1024 * 1024 ? 1 : 2)} MB`;
}
function UploadIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="8" cy="9" r="1.4" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m4 18 5.4-5 3.5 3 2.1-2 5 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 4h10m-6.5 3v4m3-4v4M5 4l.7-2h4.6l.7 2m-6.3 0 .55 9h5.5l.55-9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
