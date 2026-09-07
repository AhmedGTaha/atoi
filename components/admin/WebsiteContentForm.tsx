"use client";

import { useActionState } from "react";
import {
  saveWebsiteContentAction,
  type WebsiteContentFormState,
} from "@/app/actions/websiteContentActions";
import { Button } from "@/components/ui/Button";
import type { WebsiteContentField } from "@/lib/content/defaultWebsiteContent";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";

const initialState: WebsiteContentFormState = {};

const SECTION_LABELS: Record<WebsiteContentField["section"], string> = {
  hero: "Hero",
  services: "Services",
  process: "Process",
  work: "Selected Work",
  about: "About",
  finalCta: "Final CTA",
  footer: "Footer",
};

export function WebsiteContentForm({
  fields,
  content,
}: {
  fields: WebsiteContentField[];
  content: WebsiteContentMap;
}) {
  const [state, formAction, isPending] = useActionState(
    saveWebsiteContentAction,
    initialState,
  );

  const sections = Array.from(new Set(fields.map((f) => f.section)));

  return (
    <form action={formAction} className="space-y-8">
      {sections.map((section) => (
        <section key={section}>
          <h2 className="mb-4 text-lg font-semibold">
            {SECTION_LABELS[section]}
          </h2>
          <div className="space-y-5">
            {fields
              .filter((f) => f.section === section)
              .map((field) => {
                const current = content[field.key] ?? {
                  valueEn: field.valueEn,
                  valueAr: field.valueAr,
                };
                const Control = field.multiline ? "textarea" : "input";
                return (
                  <div
                    key={field.key}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold">
                        {field.label} (English)
                      </span>
                      <Control
                        name={`${field.key}__en`}
                        defaultValue={current.valueEn}
                        rows={field.multiline ? 3 : undefined}
                        className="input"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-semibold">
                        {field.label} (Arabic)
                      </span>
                      <Control
                        name={`${field.key}__ar`}
                        dir="rtl"
                        defaultValue={current.valueAr}
                        rows={field.multiline ? 3 : undefined}
                        className="input"
                      />
                    </label>
                  </div>
                );
              })}
          </div>
        </section>
      ))}

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-success">
          Content saved and published.
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Saving…" : "Save & publish"}
      </Button>
    </form>
  );
}
