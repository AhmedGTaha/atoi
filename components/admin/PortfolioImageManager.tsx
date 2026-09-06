"use client";

import { useActionState } from "react";
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
    initialState
  );

  return (
    <div>
      <form action={formAction} className="flex flex-wrap items-center gap-3">
        <input type="file" name="image" accept="image/png,image/jpeg,image/webp,image/avif" required className="text-sm" />
        <Button type="submit" variant="outline" disabled={isPending}>
          {isPending ? "Uploading…" : "Add image"}
        </Button>
      </form>
      {state.error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image, index) => (
          <div key={image.id} className="overflow-hidden border border-black/10">
            <div className="relative aspect-square bg-cream-dim">
              <Image src={image.publicUrl} alt="" fill sizes="200px" className="object-cover" />
              {image.isMain && (
                <span className="absolute start-2 top-2 bg-ink px-2 py-0.5 text-xs font-semibold text-white">
                  Main
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-1 p-2">
              <div className="flex gap-1">
                <form action={movePortfolioImageAction.bind(null, image.id, "up")}>
                  <button type="submit" aria-label="Move image up" disabled={index === 0} className="border border-black/10 px-1.5 py-0.5 text-xs disabled:opacity-30">
                    ↑
                  </button>
                </form>
                <form action={movePortfolioImageAction.bind(null, image.id, "down")}>
                  <button
                    type="submit"
                    aria-label="Move image down" disabled={index === images.length - 1}
                    className="border border-black/10 px-1.5 py-0.5 text-xs disabled:opacity-30"
                  >
                    ↓
                  </button>
                </form>
              </div>
              <div className="flex gap-2">
                {!image.isMain && (
                  <form action={setMainPortfolioImageAction.bind(null, projectId, image.id)}>
                    <button type="submit" className="text-xs font-semibold text-muted hover:text-ink">
                      Set main
                    </button>
                  </form>
                )}
                <form action={removePortfolioImageAction.bind(null, image.id)}>
                  <button type="submit" className="text-xs font-semibold text-danger hover:text-danger">
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
