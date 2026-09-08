import "server-only";
import { prisma } from "@/lib/db/client";
import { hashToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";
import type { TeamSessionPayload, CustomerSessionPayload } from "@/lib/auth/session";

export interface TokenConsumeResult {
  ok: boolean;
  /** Semantic error code (see lib/i18n/errors.ts), not display text. */
  error?: string;
  /**
   * Present only for a freshly-accepted team invitation — the caller must
   * create a session from this and redirect straight into the team
   * workspace instead of sending the user to the login page.
   */
  session?: TeamSessionPayload | CustomerSessionPayload;
  redirectTo?: string;
}

/**
 * Shared by the customer invite/reset flow and the team member invite/reset
 * flow: all four end in "set a password with a one-time token", they just
 * update a different table (branched on which owner the token was issued
 * for) and, for a team INVITE specifically, sign the user straight in
 * instead of sending them to the login page.
 */
export async function consumeSetPasswordToken(
  rawToken: string,
  newPassword: string
): Promise<TokenConsumeResult> {
  const tokenHash = hashToken(rawToken);
  const token = await prisma.secureToken.findUnique({ where: { tokenHash } });

  if (!token) return { ok: false, error: "TOKEN_INVALID_OR_USED" };
  if (token.usedAt) return { ok: false, error: "TOKEN_ALREADY_USED" };
  if (token.expiresAt < new Date()) {
    return { ok: false, error: "TOKEN_EXPIRED" };
  }

  const passwordHash = await hashPassword(newPassword);

  if (token.teamMemberId) {
    const member = await prisma.teamMember.findUniqueOrThrow({ where: { id: token.teamMemberId } });
    if (!member.isActive) {
      return { ok: false, error: "ACCOUNT_DEACTIVATED" };
    }

    await prisma.$transaction([
      prisma.teamMember.update({
        where: { id: token.teamMemberId },
        data: { passwordHash, accountStatus: "ACTIVE" },
      }),
      prisma.secureToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
    ]);

    if (token.type === "TEAM_MEMBER_INVITE") {
      return {
        ok: true,
        session: { role: "team", teamMemberId: member.id, email: member.email, name: member.name },
      };
    }
    return { ok: true, redirectTo: "/login?passwordSet=1" };
  }

  if (token.customerId) {
    await prisma.$transaction([
      prisma.customer.update({
        where: { id: token.customerId },
        data: { passwordHash, accountStatus: "ACTIVE" },
      }),
      prisma.secureToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
    ]);
    return { ok: true, redirectTo: "/login?passwordSet=1" };
  }

  return { ok: false, error: "TOKEN_INVALID" };
}
