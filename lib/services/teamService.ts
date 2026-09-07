import "server-only";
import { prisma } from "@/lib/db/client";
import type { TeamMemberInput } from "@/lib/validation/team";
import { generateRawToken, hashToken, INVITE_TOKEN_TTL_MS, RESET_TOKEN_TTL_MS } from "@/lib/auth/tokens";
import { verifyPassword } from "@/lib/auth/password";
import { sendEmail } from "@/lib/email/resend";
import { teamMemberInvitationEmail, passwordResetEmail } from "@/lib/email/templates";
import { getCompanySettings } from "./settingsService";
import { appUrl } from "@/lib/utils/appUrl";
import { assertEmailAvailableForRole } from "./accountIdentityService";
import type { TeamMember } from "@prisma/client";

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
  await assertEmailAvailableForRole(input.email, "team");
  return prisma.teamMember.create({ data: input });
}

export async function updateTeamMember(id: string, input: TeamMemberInput) {
  await assertEmailAvailableForRole(input.email, "team");
  return prisma.teamMember.update({ where: { id }, data: input });
}

export async function setTeamMemberActive(id: string, isActive: boolean) {
  return prisma.teamMember.update({ where: { id }, data: { isActive } });
}

export async function listActiveTeamMembers() {
  return prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
}

/**
 * Only succeeds for a fully set-up, enabled account: password set,
 * invitation accepted (ACTIVE), and not deactivated by an admin.
 */
export async function authenticateTeamMember(
  email: string,
  password: string
): Promise<TeamMember | null> {
  const member = await prisma.teamMember.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!member || !member.passwordHash) return null;
  if (member.accountStatus !== "ACTIVE" || !member.isActive) return null;

  const valid = await verifyPassword(password, member.passwordHash);
  return valid ? member : null;
}

/** Projects currently assigned to this team member, most recently updated first. */
export async function listTeamMemberProjects(teamMemberId: string) {
  const memberships = await prisma.projectMember.findMany({
    where: { teamMemberId },
    include: { project: true },
    orderBy: { project: { updatedAt: "desc" } },
  });
  return memberships.map((m) => m.project);
}

/**
 * Authorization-critical: only returns the project if this team member is
 * actually assigned to it, so an ID swap in the URL cannot leak a project
 * they have no business seeing.
 */
export async function getAssignedTeamMemberProject(teamMemberId: string, projectId: string) {
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_teamMemberId: { projectId, teamMemberId } },
  });
  if (!membership) return null;

  return prisma.project.findUnique({
    where: { id: projectId },
    include: {
      customer: true,
      updates: { orderBy: { createdAt: "desc" } },
    },
  });
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

/**
 * Sends a password-reset link to an already-active team member. Always
 * behaves the same whether or not the account exists / is eligible, so the
 * form can't be used to enumerate team member emails.
 */
export async function requestTeamMemberPasswordReset(email: string): Promise<void> {
  const member = await prisma.teamMember.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!member || member.accountStatus !== "ACTIVE" || !member.isActive) return;

  const rawToken = generateRawToken();
  await prisma.secureToken.create({
    data: {
      teamMemberId: member.id,
      type: "PASSWORD_RESET",
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const settings = await getCompanySettings();
  const email_ = passwordResetEmail("en", settings.companyName, appUrl(`/set-password?token=${rawToken}&mode=reset`));
  await sendEmail({ to: member.email, subject: email_.subject, html: email_.html });
}
