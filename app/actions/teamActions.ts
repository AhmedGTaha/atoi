"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { teamMemberSchema } from "@/lib/validation/team";
import {
  createTeamMember,
  updateTeamMember,
  setTeamMemberActive,
  deleteTeamMember,
  sendTeamMemberInvitation,
} from "@/lib/services/teamService";

export interface TeamFormState {
  error?: string;
  success?: boolean;
}

export async function createTeamMemberAction(
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireAdmin();
  const parsed = teamMemberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await createTeamMember(parsed.data);
  } catch {
    return { error: "A team member with this email already exists." };
  }

  revalidatePath("/admin/team");
  return { success: true };
}

export async function updateTeamMemberAction(
  memberId: string,
  _prevState: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireAdmin();
  const parsed = teamMemberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await updateTeamMember(memberId, parsed.data);
  revalidatePath("/admin/team");
  return { success: true };
}

export async function setTeamMemberActiveAction(memberId: string, isActive: boolean) {
  await requireAdmin();
  await setTeamMemberActive(memberId, isActive);
  revalidatePath("/admin/team");
}

export interface ResendTeamInviteState {
  sent?: boolean;
  error?: string;
}

export async function resendTeamMemberInvitationAction(
  memberId: string,
  _prevState: ResendTeamInviteState
): Promise<ResendTeamInviteState> {
  await requireAdmin();
  const result = await sendTeamMemberInvitation(memberId);
  if (result === "FAILED") {
    return { error: "Unable to send invitation. This member may already be active." };
  }
  revalidatePath("/admin/team");
  return { sent: true };
}

export interface DeleteTeamMemberState {
  success?: boolean;
  error?: string;
}

export async function deleteTeamMemberAction(
  memberId: string,
  _prevState: DeleteTeamMemberState
): Promise<DeleteTeamMemberState> {
  await requireAdmin();
  try {
    await deleteTeamMember(memberId);
  } catch {
    return { error: "Unable to delete this team member. Please try again." };
  }
  revalidatePath("/admin/team");
  return { success: true };
}
