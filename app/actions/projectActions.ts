"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { updateProjectDetails, publishProjectUpdate } from "@/lib/services/projectService";
import { updateProjectSchema, projectUpdateInputSchema } from "@/lib/validation/project";

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
