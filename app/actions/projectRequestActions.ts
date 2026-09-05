"use server";

import { headers } from "next/headers";
import { submitProjectRequest, type SubmitProjectRequestResult } from "@/lib/services/projectRequestService";
import { rateLimit, clientIpFrom } from "@/lib/utils/rateLimit";

export async function submitProjectRequestAction(
  formData: FormData
): Promise<SubmitProjectRequestResult> {
  const headerList = await headers();
  const ip = clientIpFrom(headerList);

  const limit = rateLimit(`project-request:${ip}`, { limit: 8, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return { ok: false, fieldErrors: { form: "Too many requests. Please try again in a few minutes." } };
  }

  const raw = {
    businessType: emptyToUndefined(formData.get("businessType")),
    name: emptyToUndefined(formData.get("name")),
    businessName: emptyToUndefined(formData.get("businessName")),
    description: formData.get("description") ?? "",
    email: formData.get("email") ?? "",
    phoneCountry: formData.get("phoneCountry") ?? "BH",
    phoneNumber: formData.get("phoneNumber") ?? "",
    preferredLocale: formData.get("preferredLocale") ?? "en",
    website: formData.get("website") ?? "",
  };

  return submitProjectRequest(raw);
}

function emptyToUndefined(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string" || value.trim().length === 0) return undefined;
  return value;
}
