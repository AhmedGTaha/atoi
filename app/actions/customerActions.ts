"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { sendCustomerInvitation } from "@/lib/services/customerService";

export interface ResendInviteState {
  sent?: boolean;
  error?: string;
}

export async function resendInviteAction(
  customerId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: ResendInviteState
): Promise<ResendInviteState> {
  await requireAdmin();
  const state = await sendCustomerInvitation(customerId);
  revalidatePath(`/admin/customers/${customerId}`);
  if (state === "FAILED") {
    return { error: "Could not send the invitation email. The customer may already be active." };
  }
  return { sent: true };
}
