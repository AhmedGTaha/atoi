"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import {
  archiveProjectRequest,
  deleteProjectRequest,
} from "@/lib/services/requestService";
import { convertRequestToProject } from "@/lib/services/projectService";
import { isGccCountryCode, type GccCountryCode } from "@/lib/validation/phone";

export async function archiveRequestAction(requestId: string) {
  await requireAdmin();
  await archiveProjectRequest(requestId);
}

export interface DeleteRequestState {
  success?: boolean;
  error?: string;
}

export async function deleteRequestAction(
  requestId: string,
  _prevState: DeleteRequestState,
): Promise<DeleteRequestState> {
  void _prevState;
  await requireAdmin();
  try {
    await deleteProjectRequest(requestId);
  } catch {
    return { error: "Unable to delete this request. Please try again." };
  }

  revalidatePath("/admin/requests");
  revalidatePath("/admin");
  return { success: true };
}

export interface ConvertRequestState {
  error?: string;
}

export async function convertRequestAction(
  _prevState: ConvertRequestState,
  formData: FormData
): Promise<ConvertRequestState> {
  await requireAdmin();

  const requestId = String(formData.get("requestId") ?? "");
  const projectName = String(formData.get("projectName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const customerName = emptyToNull(formData.get("customerName"));
  const businessName = emptyToNull(formData.get("businessName"));
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phoneCountry = String(formData.get("phoneCountry") ?? "BH");
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  const memberIds = formData.getAll("memberIds").map(String);

  if (!projectName || projectName.length < 2) {
    return { error: "Enter a project name." };
  }
  if (!description) {
    return { error: "Description is required." };
  }
  if (!email) {
    return { error: "Email is required." };
  }
  if (!isGccCountryCode(phoneCountry)) {
    return { error: "Select a valid GCC country." };
  }

  let projectId: string;
  try {
    const result = await convertRequestToProject({
      requestId,
      projectName,
      description,
      customerName,
      businessName,
      email,
      phoneCountry: phoneCountry as GccCountryCode,
      phoneNumber,
      memberIds,
    });
    projectId = result.projectId;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not convert this request." };
  }

  redirect(`/admin/projects/${projectId}`);
}

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  return value.trim();
}
