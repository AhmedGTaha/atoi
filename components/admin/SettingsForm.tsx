"use client";

import { useActionState } from "react";
import {
  updateSettingsAction,
  type SettingsFormState,
} from "@/app/actions/settingsActions";
import { AdminInput, AdminTextarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import type { CompanySettings } from "@prisma/client";

const initialState: SettingsFormState = {};

export function SettingsForm({ settings }: { settings: CompanySettings }) {
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput
          label="Company name"
          name="companyName"
          required
          defaultValue={settings.companyName}
        />
        <AdminInput
          label="Company email"
          name="companyEmail"
          type="email"
          required
          defaultValue={settings.companyEmail}
        />
        <AdminInput
          label="Company phone"
          name="companyPhone"
          required
          defaultValue={settings.companyPhone}
        />
        <AdminInput
          label="WhatsApp number"
          name="whatsappPhone"
          defaultValue={settings.whatsappPhone ?? ""}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput
          label="Location (English)"
          name="locationEn"
          required
          defaultValue={settings.locationEn}
        />
        <AdminInput
          label="Location (Arabic)"
          name="locationAr"
          required
          defaultValue={settings.locationAr}
          dir="rtl"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput
          label="Instagram URL"
          name="instagramUrl"
          defaultValue={settings.instagramUrl ?? ""}
        />
        <AdminInput
          label="LinkedIn URL"
          name="linkedinUrl"
          defaultValue={settings.linkedinUrl ?? ""}
        />
      </div>

      <p className="text-sm text-muted">
        New requests and support messages notify every active admin and team
        member automatically — there&apos;s nothing to configure here.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput
          label="SEO title (English)"
          name="seoTitleEn"
          required
          defaultValue={settings.seoTitleEn}
        />
        <AdminInput
          label="SEO title (Arabic)"
          name="seoTitleAr"
          required
          defaultValue={settings.seoTitleAr}
          dir="rtl"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminTextarea
          label="SEO description (English)"
          name="seoDescriptionEn"
          rows={2}
          required
          defaultValue={settings.seoDescriptionEn}
        />
        <AdminTextarea
          label="SEO description (Arabic)"
          name="seoDescriptionAr"
          rows={2}
          required
          defaultValue={settings.seoDescriptionAr}
          dir="rtl"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-success">
          Settings saved.
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
