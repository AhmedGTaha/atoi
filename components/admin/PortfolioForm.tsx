"use client";

import { useActionState } from "react";
import { AdminInput, AdminTextarea, Card } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { PortfolioImageManager } from "@/components/admin/PortfolioImageManager";
import type { PortfolioFormState } from "@/app/actions/portfolioActions";
import type { PortfolioProjectWithImages } from "@/lib/services/portfolioService.types";

const initialState: PortfolioFormState = {};

const GRID_CLASS =
  "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(380px,.9fr)]";

/**
 * Shared create/edit UI: project details on the left, the image manager (and
 * optional extra panels, e.g. a danger zone) on the right. Everything lives
 * inside one <form> so a brand-new project can be created and have images
 * attached in a single submission (see PortfolioImageManager's create mode).
 */
export function PortfolioForm({
  mode,
  project,
  action,
  submitLabel,
  rightPanelExtra,
}: {
  mode: "create" | "edit";
  project?: PortfolioProjectWithImages;
  action: (
    state: PortfolioFormState,
    formData: FormData,
  ) => Promise<PortfolioFormState>;
  submitLabel: string;
  rightPanelExtra?: React.ReactNode;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const isCreate = mode === "create";

  return (
    <form action={formAction} className={GRID_CLASS}>
      <Card className="portfolio-details-card">
        <h2 className="mb-5 font-display text-base">Project details</h2>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminInput
              label="Title (English)"
              name="titleEn"
              required
              defaultValue={project?.titleEn}
            />
            <AdminInput
              label="Title (Arabic)"
              name="titleAr"
              required
              dir="rtl"
              defaultValue={project?.titleAr}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminTextarea
              label="Description (English)"
              name="descriptionEn"
              required
              rows={3}
              defaultValue={project?.descriptionEn}
            />
            <AdminTextarea
              label="Description (Arabic)"
              name="descriptionAr"
              required
              rows={3}
              dir="rtl"
              defaultValue={project?.descriptionAr}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminInput
              label="Category / business type (English)"
              name="category"
              defaultValue={project?.category ?? ""}
            />
            <AdminInput
              label="Category / business type (Arabic)"
              name="categoryAr"
              dir="rtl"
              hint="Optional — falls back to the English category when empty."
              defaultValue={project?.categoryAr ?? ""}
            />
          </div>

          <AdminInput
            label="Live URL (optional)"
            name="liveUrl"
            defaultValue={project?.liveUrl ?? ""}
            placeholder="https://"
          />

          <AdminInput
            label="Technologies"
            name="technologies"
            hint="Separate technologies with commas. These appear as compact labels on the public project card."
            defaultValue={project?.technologies.join(", ") ?? ""}
            placeholder="e.g. Next.js, TypeScript, PostgreSQL"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="portfolio-state-control">
              <input
                type="checkbox"
                name="published"
                defaultChecked={project?.published}
              />
              <span>
                <strong>Published</strong>
                <small>Show on the public website</small>
              </span>
            </label>
            <label className="portfolio-state-control">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={project?.featured}
              />
              <span>
                <strong>Featured</strong>
                <small>Highlight this project</small>
              </span>
            </label>
          </div>

          {state.error && (
            <p role="alert" className="text-sm text-danger">
              {state.error}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? "Saving…" : submitLabel}
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        <Card>
          <PortfolioImageManager
            mode={isCreate ? "create" : "edit"}
            projectId={project?.id}
            images={project?.images ?? []}
          />
        </Card>
        {!isCreate && rightPanelExtra}
      </div>
    </form>
  );
}
