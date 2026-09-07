import "server-only";
import { prisma } from "@/lib/db/client";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export type AuthenticatedAccount =
  | { role: "admin"; id: string; email: string; name: string }
  | { role: "team"; id: string; email: string; name: string }
  | { role: "customer"; id: string; email: string };

// A precomputed valid bcrypt hash, compared against on every login attempt
// that doesn't resolve to a real, eligible account — so a nonexistent email
// takes roughly the same time to reject as a wrong password does, instead
// of returning instantly and leaking which emails are registered.
let dummyHashPromise: Promise<string> | null = null;
function getDummyHash(): Promise<string> {
  if (!dummyHashPromise) dummyHashPromise = hashPassword("no-such-account-timing-guard");
  return dummyHashPromise;
}

/**
 * Resolves a single set of login credentials against all three account
 * tables at once — the caller (the universal /login form) never chooses a
 * role, so the backend has to determine it securely.
 *
 * If an email were ever shared across roles (should not happen going
 * forward — see accountIdentityService — but existing data is never
 * destroyed automatically), priority is admin > team > customer,
 * deterministic and stable.
 */
export async function authenticateAny(
  rawEmail: string,
  password: string
): Promise<AuthenticatedAccount | null> {
  const email = rawEmail.trim().toLowerCase();

  const [admin, team, customer] = await Promise.all([
    prisma.adminUser.findUnique({ where: { email } }),
    prisma.teamMember.findUnique({ where: { email } }),
    prisma.customer.findUnique({ where: { email } }),
  ]);

  const candidates: {
    role: "admin" | "team" | "customer";
    id: string;
    email: string;
    name?: string;
    passwordHash: string | null;
  }[] = [];

  if (admin && admin.isActive) {
    candidates.push({ role: "admin", id: admin.id, email: admin.email, name: admin.name, passwordHash: admin.passwordHash });
  }
  if (team && team.isActive && team.accountStatus === "ACTIVE") {
    candidates.push({ role: "team", id: team.id, email: team.email, name: team.name, passwordHash: team.passwordHash });
  }
  if (customer && customer.accountStatus === "ACTIVE") {
    candidates.push({ role: "customer", id: customer.id, email: customer.email, passwordHash: customer.passwordHash });
  }

  const chosen = candidates[0] ?? null;
  const hashToCompare = chosen?.passwordHash ?? (await getDummyHash());
  const valid = await verifyPassword(password, hashToCompare);

  if (!chosen || !chosen.passwordHash || !valid) return null;

  if (chosen.role === "customer") {
    return { role: "customer", id: chosen.id, email: chosen.email };
  }
  return { role: chosen.role, id: chosen.id, email: chosen.email, name: chosen.name! };
}
