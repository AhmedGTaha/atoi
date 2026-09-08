"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import {
  updateProjectDetails,
  publishProjectUpdate,
  createProjectForCustomer,
  deleteProject,
} from "@/lib/services/projectService";
import { updateProjectSchema, projectUpdateInputSchema } from "@/lib/validation/project";
import { isGccCountryCode, type GccCountryCode } from "@/lib/validation/phone";

export interface ProjectFormState {
  error?: string;
  success?: boolean;
}

export async function updateProjectAction(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();

  const projectId = String(formData.get("projectId") ?? "");
  const parsed = updateProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status"),
    progress: Number(formData.get("progress")),
    memberIds: formData.getAll("memberIds").map(String),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await updateProjectDetails(projectId, parsed.data);
  revalidatePath(`/admin/projects/${projectId}`);
  return { success: true };
}

export interface PublishUpdateState {
  error?: string;
  success?: boolean;
  emailSent?: boolean;
}

export async function publishUpdateAction(
  _prevState: PublishUpdateState,
  formData: FormData
): Promise<PublishUpdateState> {
  const identity = await requireAdmin();

  const projectId = String(formData.get("projectId") ?? "");
  const parsed = projectUpdateInputSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid update text." };
  }

  const result = await publishProjectUpdate(
    projectId,
    { kind: identity.kind, id: identity.id },
    parsed.data.body,
  );
  revalidatePath(`/admin/projects/${projectId}`);
  return { success: true, emailSent: result.emailSent };
}

export interface CreateProjectState {
  error?: string;
}

export async function createProjectForCustomerAction(
  _prevState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  await requireAdmin();

  const customerId = String(formData.get("customerId") ?? "");
  const projectName = String(formData.get("projectName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const phoneCountry = String(formData.get("phoneCountry") ?? "BH");
  const phoneNumber = String(formData.get("phoneNumber") ?? "").trim();
  const memberIds = formData.getAll("memberIds").map(String);

  if (!customerId) {
    return { error: "Missing customer." };
  }
  if (!projectName || projectName.length < 2) {
    return { error: "Enter a project name." };
  }
  if (!description) {
    return { error: "Description is required." };
  }
  if (!isGccCountryCode(phoneCountry)) {
    return { error: "Select a valid GCC country." };
  }

  let projectId: string;
  try {
    const result = await createProjectForCustomer({
      customerId,
      projectName,
      description,
      phoneCountry: phoneCountry as GccCountryCode,
      phoneNumber,
      memberIds,
    });
    projectId = result.projectId;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not create this project." };
  }

  revalidatePath(`/admin/customers/${customerId}`);
  redirect(`/admin/projects/${projectId}`);
}

export interface DeleteProjectState {
  success?: boolean;
  error?: string;
}

export async function deleteProjectAction(
  projectId: string,
  customerId: string,
  _prevState: DeleteProjectState,
): Promise<DeleteProjectState> {
  void _prevState;
  await requireAdmin();
  try {
    await deleteProject(projectId);
  } catch {
    return { error: "Unable to delete this project. Please try again." };
  }

  revalidatePath(`/admin/customers/${customerId}`);
  revalidatePath("/admin/projects");
  return { success: true };
}
