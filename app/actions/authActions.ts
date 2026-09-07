"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { loginSchema, setPasswordSchema, forgotPasswordSchema } from "@/lib/validation/auth";
import { authenticateAny } from "@/lib/services/authService";
import { requestPasswordReset } from "@/lib/services/customerService";
import { requestTeamMemberPasswordReset } from "@/lib/services/teamService";
import { consumeSetPasswordToken } from "@/lib/services/secureTokenService";
import {
  createAdminSession,
  createCustomerSession,
  createTeamSession,
  destroyAllSessions,
} from "@/lib/auth/session";
import { rateLimit, clientIpFrom } from "@/lib/utils/rateLimit";

export interface LoginState {
  error?: string;
}

/**
 * The one sign-in form for every role. The backend — not the user —
 * determines whether the email belongs to an admin, a team member, or a
 * customer, and redirects accordingly. Errors are always the same generic
 * message so a failed attempt never reveals which role (or whether any
 * account at all) an email belongs to.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const headerList = await headers();
  const ip = clientIpFrom(headerList);
  const limit = rateLimit(`login:${ip}`, { limit: 10, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return { error: "Too many attempts. Please try again in a few minutes." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Incorrect email or password." };
  }

  const account = await authenticateAny(parsed.data.email, parsed.data.password);
  if (!account) {
    return { error: "Incorrect email or password." };
  }

  if (account.role === "admin") {
    await createAdminSession({
      role: "admin",
      adminId: account.id,
      email: account.email,
      name: account.name,
    });
    redirect("/admin");
  }

  if (account.role === "team") {
    await createTeamSession({
      role: "team",
      teamMemberId: account.id,
      email: account.email,
      name: account.name,
    });
    redirect("/team");
  }

  await createCustomerSession({ role: "customer", customerId: account.id, email: account.email });
  redirect("/portal");
}

/** Clears whichever session cookie is set and returns to the sign-in page. Works for every role. */
export async function logoutAction() {
  await destroyAllSessions();
  redirect("/login");
}

export interface ForgotPasswordState {
  submitted?: boolean;
  error?: string;
}

/**
 * Covers every account type that's allowed to self-serve a password reset
 * (customers and team members — admins are provisioned directly and have
 * no self-service reset). Always reports success, whether or not the
 * account exists, so the form can't be used to enumerate registered
 * emails.
 */
export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const headerList = await headers();
  const ip = clientIpFrom(headerList);
  const limit = rateLimit(`forgot-password:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) {
    return { error: "Too many attempts. Please try again later." };
  }

  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  await Promise.all([
    requestPasswordReset(parsed.data.email),
    requestTeamMemberPasswordReset(parsed.data.email),
  ]);

  return { submitted: true };
}

export interface SetPasswordState {
  error?: string;
}

/**
 * Consumes an invite/reset token and sets a password. A freshly-accepted
 * team invitation signs the user straight in and lands them in the team
 * workspace — every other case (customer invite/reset, team reset) sends
 * them to the sign-in page instead.
 */
export async function setPasswordAction(
  _prevState: SetPasswordState,
  formData: FormData
): Promise<SetPasswordState> {
  const parsed = setPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const result = await consumeSetPasswordToken(parsed.data.token, parsed.data.password);
  if (!result.ok) {
    return { error: result.error };
  }

  if (result.session?.role === "team") {
    await createTeamSession(result.session);
    redirect("/team");
  }
  if (result.session?.role === "customer") {
    await createCustomerSession(result.session);
    redirect("/portal");
  }

  redirect(result.redirectTo ?? "/login?passwordSet=1");
}
