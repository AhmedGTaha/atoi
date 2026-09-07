import "server-only";
import { prisma } from "@/lib/db/client";

export type AccountRole = "admin" | "team" | "customer";

const ROLE_LABEL: Record<AccountRole, string> = {
  admin: "an admin",
  team: "a team member",
  customer: "a customer",
};

/**
 * An email address must not represent more than one authentication
 * identity across AdminUser / TeamMember / Customer — otherwise the
 * universal login can't tell which account a password belongs to.
 * Call this before creating a new account in any of the three tables.
 */
export async function findEmailOwner(
  email: string,
  excludeRole?: AccountRole
): Promise<AccountRole | null> {
  const normalized = email.trim().toLowerCase();

  const [admin, team, customer] = await Promise.all([
    excludeRole === "admin"
      ? null
      : prisma.adminUser.findUnique({ where: { email: normalized }, select: { id: true } }),
    excludeRole === "team"
      ? null
      : prisma.teamMember.findUnique({ where: { email: normalized }, select: { id: true } }),
    excludeRole === "customer"
      ? null
      : prisma.customer.findUnique({ where: { email: normalized }, select: { id: true } }),
  ]);

  if (admin) return "admin";
  if (team) return "team";
  if (customer) return "customer";
  return null;
}

/**
 * Throws a descriptive error if `email` already belongs to a DIFFERENT
 * role than `role`. Does not check for a same-role duplicate — the
 * caller's own unique constraint (and its existing error handling)
 * already covers that case.
 */
export async function assertEmailAvailableForRole(email: string, role: AccountRole): Promise<void> {
  const owner = await findEmailOwner(email, role);
  if (owner) {
    throw new Error(`This email is already registered as ${ROLE_LABEL[owner]} account.`);
  }
}
