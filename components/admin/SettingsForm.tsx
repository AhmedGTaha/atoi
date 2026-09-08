"use client";

import { useActionState, useEffect, useState } from "react";
import {
  updateSettingsAction,
  type SettingsFormState,
} from "@/app/actions/settingsActions";
import { AdminInput, AdminTextarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import type { CompanySettings } from "@prisma/client";

const initialState: SettingsFormState = {};

interface SettingsFormValues {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  whatsappPhone: string;
  locationEn: string;
  locationAr: string;
  instagramUrl: string;
  linkedinUrl: string;
  seoTitleEn: string;
  seoTitleAr: string;
  seoDescriptionEn: string;
  seoDescriptionAr: string;
}

export function SettingsForm({ settings }: { settings: CompanySettings }) {
  const [state, formAction, isPending] = useActionState(
    updateSettingsAction,
    initialState,
  );
  // React resets uncontrolled forms after a server action completes. Keep the
  // settings controlled so a successful save does not snap the fields back to
  // the values from the preceding render.
  const [values, setValues] = useState<SettingsFormValues>({
    companyName: settings.companyName,
    companyEmail: settings.companyEmail,
    companyPhone: settings.companyPhone,
    whatsappPhone: settings.whatsappPhone ?? "",
    locationEn: settings.locationEn,
    locationAr: settings.locationAr,
    instagramUrl: settings.instagramUrl ?? "",
    linkedinUrl: settings.linkedinUrl ?? "",
    seoTitleEn: settings.seoTitleEn,
    seoTitleAr: settings.seoTitleAr,
    seoDescriptionEn: settings.seoDescriptionEn,
    seoDescriptionAr: settings.seoDescriptionAr,
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (state.success) setIsDirty(false);
  }, [state]);

  function updateValue(field: keyof SettingsFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setIsDirty(true);
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput
          label="Company name"
          name="companyName"
          required
          value={values.companyName}
          onChange={(event) => updateValue("companyName", event.target.value)}
        />
        <AdminInput
          label="Company email"
          name="companyEmail"
          type="email"
          required
          value={values.companyEmail}
          onChange={(event) => updateValue("companyEmail", event.target.value)}
        />
        <AdminInput
          label="Company phone"
          name="companyPhone"
          required
          value={values.companyPhone}
          onChange={(event) => updateValue("companyPhone", event.target.value)}
        />
        <AdminInput
          label="WhatsApp number"
          name="whatsappPhone"
          value={values.whatsappPhone}
          onChange={(event) => updateValue("whatsappPhone", event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput
          label="Location (English)"
          name="locationEn"
          required
          value={values.locationEn}
          onChange={(event) => updateValue("locationEn", event.target.value)}
        />
        <AdminInput
          label="Location (Arabic)"
          name="locationAr"
          required
          value={values.locationAr}
          onChange={(event) => updateValue("locationAr", event.target.value)}
          dir="rtl"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput
          label="Instagram URL"
          name="instagramUrl"
          value={values.instagramUrl}
          onChange={(event) => updateValue("instagramUrl", event.target.value)}
        />
        <AdminInput
          label="LinkedIn URL"
          name="linkedinUrl"
          value={values.linkedinUrl}
          onChange={(event) => updateValue("linkedinUrl", event.target.value)}
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
          value={values.seoTitleEn}
          onChange={(event) => updateValue("seoTitleEn", event.target.value)}
        />
        <AdminInput
          label="SEO title (Arabic)"
          name="seoTitleAr"
          required
          value={values.seoTitleAr}
          onChange={(event) => updateValue("seoTitleAr", event.target.value)}
          dir="rtl"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminTextarea
          label="SEO description (English)"
          name="seoDescriptionEn"
          rows={2}
          required
          value={values.seoDescriptionEn}
          onChange={(event) =>
            updateValue("seoDescriptionEn", event.target.value)
          }
        />
        <AdminTextarea
          label="SEO description (Arabic)"
          name="seoDescriptionAr"
          rows={2}
          required
          value={values.seoDescriptionAr}
          onChange={(event) =>
            updateValue("seoDescriptionAr", event.target.value)
          }
          dir="rtl"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.success && !isDirty && (
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
