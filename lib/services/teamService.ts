import "server-only";
import { prisma } from "@/lib/db/client";
import type { TeamMemberInput } from "@/lib/validation/team";
import { generateRawToken, hashToken, INVITE_TOKEN_TTL_MS } from "@/lib/auth/tokens";
import { sendEmail } from "@/lib/email/resend";
import { teamMemberInvitationEmail } from "@/lib/email/templates";
import { getCompanySettings } from "./settingsService";
import { appUrl } from "@/lib/utils/appUrl";

export async function listTeamMembers() {
  return prisma.teamMember.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      accountStatus: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { projects: true } },
    },
  });
}

export async function getTeamMember(id: string) {
  return prisma.teamMember.findUnique({ where: { id } });
}

export async function createTeamMember(input: TeamMemberInput) {
  return prisma.teamMember.create({ data: input });
}

export async function updateTeamMember(id: string, input: TeamMemberInput) {
  return prisma.teamMember.update({ where: { id }, data: input });
}

export async function setTeamMemberActive(id: string, isActive: boolean) {
  return prisma.teamMember.update({ where: { id }, data: { isActive } });
}

export async function listActiveTeamMembers() {
  return prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
}

/**
 * Permanently removes the team member. ProjectMember rows and any
 * SecureTokens issued to them cascade-delete at the schema level.
 */
export async function deleteTeamMember(id: string) {
  await prisma.teamMember.delete({ where: { id } });
}

/**
 * Sends (or resends) the account-setup invitation. Only sent while the
 * member is still INVITED — an already-active member never receives a new
 * account setup email. Any previously issued, unused invite token for this
 * member is invalidated so only the newest link works.
 */
export async function sendTeamMemberInvitation(teamMemberId: string): Promise<"SENT" | "FAILED"> {
  const member = await prisma.teamMember.findUniqueOrThrow({ where: { id: teamMemberId } });
  if (member.accountStatus === "ACTIVE") {
    return "FAILED";
  }

  const rawToken = generateRawToken();
  await prisma.$transaction([
    prisma.secureToken.updateMany({
      where: { teamMemberId, type: "TEAM_MEMBER_INVITE", usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.secureToken.create({
      data: {
        teamMemberId,
        type: "TEAM_MEMBER_INVITE",
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
      },
    }),
  ]);

  const settings = await getCompanySettings();
  const email = teamMemberInvitationEmail(
    settings.companyName,
    appUrl(`/set-password?token=${rawToken}&mode=team`)
  );

  return sendEmail({ to: member.email, subject: email.subject, html: email.html });
}
