"use client";

import { useActionState } from "react";
import { AdminInput, AdminTextarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import type { PortfolioProject } from "@prisma/client";
import type { PortfolioFormState } from "@/app/actions/portfolioActions";

const initialState: PortfolioFormState = {};

export function PortfolioForm({
  project,
  action,
  submitLabel,
}: {
  project?: PortfolioProject;
  action: (state: PortfolioFormState, formData: FormData) => Promise<PortfolioFormState>;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput label="Title (English)" name="titleEn" required defaultValue={project?.titleEn} />
        <AdminInput label="Title (Arabic)" name="titleAr" required dir="rtl" defaultValue={project?.titleAr} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminTextarea label="Description (English)" name="descriptionEn" required rows={3} defaultValue={project?.descriptionEn} />
        <AdminTextarea label="Description (Arabic)" name="descriptionAr" required rows={3} dir="rtl" defaultValue={project?.descriptionAr} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput label="Category / business type" name="category" defaultValue={project?.category ?? ""} />
        <AdminInput label="Client name (optional)" name="clientName" defaultValue={project?.clientName ?? ""} />
      </div>

      <AdminInput label="Live URL (optional)" name="liveUrl" defaultValue={project?.liveUrl ?? ""} placeholder="https://" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminTextarea label="Problem (English, optional)" name="problemEn" rows={3} defaultValue={project?.problemEn ?? ""} />
        <AdminTextarea label="Problem (Arabic, optional)" name="problemAr" rows={3} dir="rtl" defaultValue={project?.problemAr ?? ""} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminTextarea label="What we built (English, optional)" name="builtEn" rows={3} defaultValue={project?.builtEn ?? ""} />
        <AdminTextarea label="What we built (Arabic, optional)" name="builtAr" rows={3} dir="rtl" defaultValue={project?.builtAr ?? ""} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminTextarea label="Result (English, optional)" name="resultEn" rows={3} defaultValue={project?.resultEn ?? ""} />
        <AdminTextarea label="Result (Arabic, optional)" name="resultAr" rows={3} dir="rtl" defaultValue={project?.resultAr ?? ""} />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="published" defaultChecked={project?.published} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} />
          Featured
        </label>
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primaryDark" disabled={isPending}>
        {isPending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
