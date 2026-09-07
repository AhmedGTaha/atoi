import "server-only";
import { prisma } from "@/lib/db/client";
import { hashToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";

export interface TokenConsumeResult {
  ok: boolean;
  error?: string;
  redirectTo?: string;
}

/**
 * Shared by the customer invite/reset flow and the team member invite flow:
 * both end in "set a password with a one-time token", they just update a
 * different table depending on which owner the token was issued for.
 */
export async function consumeSetPasswordToken(
  rawToken: string,
  newPassword: string
): Promise<TokenConsumeResult> {
  const tokenHash = hashToken(rawToken);
  const token = await prisma.secureToken.findUnique({ where: { tokenHash } });

  if (!token) return { ok: false, error: "This link is invalid or has already been used." };
  if (token.usedAt) return { ok: false, error: "This link has already been used." };
  if (token.expiresAt < new Date()) {
    return { ok: false, error: "This link has expired. Please request a new one." };
  }

  const passwordHash = await hashPassword(newPassword);

  if (token.type === "TEAM_MEMBER_INVITE") {
    if (!token.teamMemberId) return { ok: false, error: "This link is invalid." };
    await prisma.$transaction([
      prisma.teamMember.update({
        where: { id: token.teamMemberId },
        data: { passwordHash, accountStatus: "ACTIVE" },
      }),
      prisma.secureToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
    ]);
    return { ok: true, redirectTo: "/" };
  }

  if (!token.customerId) return { ok: false, error: "This link is invalid." };
  await prisma.$transaction([
    prisma.customer.update({
      where: { id: token.customerId },
      data: { passwordHash, accountStatus: "ACTIVE" },
    }),
    prisma.secureToken.update({ where: { id: token.id }, data: { usedAt: new Date() } }),
  ]);
  return { ok: true, redirectTo: "/login?passwordSet=1" };
}
