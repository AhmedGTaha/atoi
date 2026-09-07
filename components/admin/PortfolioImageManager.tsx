"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import {
  uploadPortfolioImageAction,
  removePortfolioImageAction,
  movePortfolioImageAction,
  setMainPortfolioImageAction,
  type ImageUploadState,
} from "@/app/actions/portfolioActions";
import { Button } from "@/components/ui/Button";
import type { PortfolioImage } from "@prisma/client";

const initialState: ImageUploadState = {};

export function PortfolioImageManager({
  projectId,
  images,
}: {
  projectId: string;
  images: PortfolioImage[];
}) {
  const [state, formAction, isPending] = useActionState(
    uploadPortfolioImageAction.bind(null, projectId),
    initialState,
  );
  const [previewIndex, setPreviewIndex] = useState(0);
  const preview = images[Math.min(previewIndex, Math.max(0, images.length - 1))];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-display text-sm"><span>Project images</span><span className="text-muted">{images.length}/10</span></div>
      <form action={formAction} className="border border-dashed border-rule p-6 text-center">
        <input
          type="file"
          aria-label="Portfolio image"
          name="image"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          required
          className="mx-auto block max-w-full text-sm"
        />
        <p className="mt-2 text-xs text-muted">Drop images here or click to browse · PNG, JPG, WebP, AVIF · 8MB each</p>
        <Button type="submit" variant="outline" disabled={isPending || images.length >= 10} className="mt-4">
          {isPending ? "Uploading…" : "Upload images"}
        </Button>
      </form>
      {state.error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      {preview && (
        <div className="relative mt-5 border border-rule p-3">
          <p className="mb-3 font-display text-xs text-muted">Image preview</p>
          <div className="relative aspect-[16/10] overflow-hidden bg-surface">
            <Image src={preview.publicUrl} alt="" fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
            {images.length > 1 && <><button type="button" aria-label="Previous preview image" onClick={() => setPreviewIndex((index) => (index - 1 + images.length) % images.length)} className="work-image-control start-2">‹</button><button type="button" aria-label="Next preview image" onClick={() => setPreviewIndex((index) => (index + 1) % images.length)} className="work-image-control end-2">›</button></>}
          </div>
          <p className="mt-2 text-xs text-muted">{Math.min(previewIndex + 1, images.length)} / {images.length}</p>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {images.map((image, index) => (
          <div key={image.id} className="flex overflow-hidden border border-rule">
            <div className="relative aspect-[4/3] w-28 shrink-0 bg-surface">
              <Image
                src={image.publicUrl}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
              {image.isMain && (
                <span className="absolute start-2 top-2 bg-foreground px-2 py-0.5 text-xs font-semibold text-canvas">
                  Main
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-between gap-2 p-3">
              <span className="font-display text-xs text-muted">Image {index + 1}{image.isMain ? " · Cover" : ""}</span>
              <div className="flex gap-1">
                <form
                  action={movePortfolioImageAction.bind(null, image.id, "up")}
                >
                  <button
                    type="submit"
                    aria-label="Move image up"
                    disabled={index === 0}
                    className="border border-rule px-1.5 py-0.5 text-xs disabled:opacity-30"
                  >
                    ↑
                  </button>
                </form>
                <form
                  action={movePortfolioImageAction.bind(null, image.id, "down")}
                >
                  <button
                    type="submit"
                    aria-label="Move image down"
                    disabled={index === images.length - 1}
                    className="border border-rule px-1.5 py-0.5 text-xs disabled:opacity-30"
                  >
                    ↓
                  </button>
                </form>
              </div>
              <div className="flex gap-2">
                {!image.isMain && (
                  <form
                    action={setMainPortfolioImageAction.bind(
                      null,
                      projectId,
                      image.id,
                    )}
                  >
                    <button
                      type="submit"
                      className="text-xs font-semibold text-muted hover:text-foreground"
                    >
                      Set main
                    </button>
                  </form>
                )}
                <form action={removePortfolioImageAction.bind(null, image.id)}>
                  <button
                    type="submit"
                    className="text-xs font-semibold text-danger hover:text-danger"
                  >
                    Remove
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
