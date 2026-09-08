"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { companySettingsSchema } from "@/lib/validation/settings";
import {
  updateCompanySettings,
  updateCompanyLogo,
} from "@/lib/services/settingsService";
import { validateImageFile, uploadPortfolioImage } from "@/lib/storage/blob";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

export async function updateSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = companySettingsSchema.safeParse({
    companyName: formData.get("companyName"),
    companyEmail: formData.get("companyEmail"),
    companyPhone: formData.get("companyPhone"),
    whatsappPhone: formData.get("whatsappPhone") || null,
    locationEn: formData.get("locationEn"),
    locationAr: formData.get("locationAr"),
    instagramUrl: formData.get("instagramUrl") || null,
    linkedinUrl: formData.get("linkedinUrl") || null,
    seoTitleEn: formData.get("seoTitleEn"),
    seoTitleAr: formData.get("seoTitleAr"),
    seoDescriptionEn: formData.get("seoDescriptionEn"),
    seoDescriptionAr: formData.get("seoDescriptionAr"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await updateCompanySettings(parsed.data);
  revalidatePath("/admin/settings");
  return { success: true };
}

export interface LogoUploadState {
  error?: string;
  success?: boolean;
}

export async function uploadLogoAction(
  _prevState: LogoUploadState,
  formData: FormData,
): Promise<LogoUploadState> {
  await requireAdmin();

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }

  const validation = validateImageFile(file);
  if (!validation.ok) {
    return { error: validation.error };
  }

  try {
    const asset = await uploadPortfolioImage(file, "logo");
    await updateCompanyLogo(asset.storageKey, asset.publicUrl);
  } catch (err) {
    console.error("[settings] Logo upload failed:", err);
    return { error: "Upload failed. Check that image storage is configured." };
  }

  return { success: true };
}
