"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { websiteContentBatchSchema } from "@/lib/validation/websiteContent";
import { saveWebsiteContent, websiteContentFieldDefinitions } from "@/lib/services/websiteContentService";

export interface WebsiteContentFormState {
  error?: string;
  success?: boolean;
}

export async function saveWebsiteContentAction(
  _prevState: WebsiteContentFormState,
  formData: FormData
): Promise<WebsiteContentFormState> {
  await requireAdmin();

  const fields = websiteContentFieldDefinitions();
  const entries = fields.map((field) => ({
    key: field.key,
    valueEn: String(formData.get(`${field.key}__en`) ?? ""),
    valueAr: String(formData.get(`${field.key}__ar`) ?? ""),
  }));

  const parsed = websiteContentBatchSchema.safeParse({ entries });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid content." };
  }

  await saveWebsiteContent(parsed.data.entries);
  return { success: true };
}
