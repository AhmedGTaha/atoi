"use server";

import { requireCustomer } from "@/lib/auth/guards";
import { supportRequestInputSchema } from "@/lib/validation/support";
import { submitSupportRequest } from "@/lib/services/supportService";
import { getOwnedCustomerProject } from "@/lib/services/projectService";

export interface SupportFormState {
  error?: string;
  success?: boolean;
  emailSent?: boolean;
}

export async function submitSupportRequestAction(
  projectId: string,
  _prevState: SupportFormState,
  formData: FormData
): Promise<SupportFormState> {
  const customer = await requireCustomer();

  // Authorization: the project must actually belong to this customer.
  const project = await getOwnedCustomerProject(customer.id, projectId);
  if (!project) {
    return { error: "Project not found." };
  }

  const parsed = supportRequestInputSchema.safeParse({ message: formData.get("message") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid message." };
  }

  const result = await submitSupportRequest(projectId, customer.id, parsed.data.message);
  return { success: true, emailSent: result.emailSent };
}
