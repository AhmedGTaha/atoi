"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { loginSchema, setPasswordSchema, forgotPasswordSchema } from "@/lib/validation/auth";
import { authenticateCustomer, requestPasswordReset, consumeTokenAndSetPassword } from "@/lib/services/customerService";
import { createCustomerSession, destroyCustomerSession } from "@/lib/auth/session";
import { rateLimit, clientIpFrom } from "@/lib/utils/rateLimit";

export interface CustomerLoginState {
  error?: string;
}

export async function loginCustomerAction(
  _prevState: CustomerLoginState,
  formData: FormData
): Promise<CustomerLoginState> {
  const headerList = await headers();
  const ip = clientIpFrom(headerList);
  const limit = rateLimit(`customer-login:${ip}`, { limit: 10, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return { error: "Too many attempts. Please try again in a few minutes." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const customer = await authenticateCustomer(parsed.data.email, parsed.data.password);
  if (!customer) {
    return { error: "Incorrect email or password." };
  }

  await createCustomerSession({ role: "customer", customerId: customer.id, email: customer.email });
  redirect("/portal");
}

export async function logoutCustomerAction() {
  await destroyCustomerSession();
  redirect("/login");
}

export interface ForgotPasswordState {
  submitted?: boolean;
  error?: string;
}

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

  await requestPasswordReset(parsed.data.email);
  // Always report success, whether or not the account exists, to avoid
  // leaking which emails are registered.
  return { submitted: true };
}

export interface SetPasswordState {
  error?: string;
}

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

  const result = await consumeTokenAndSetPassword(parsed.data.token, parsed.data.password);
  if (!result.ok) {
    return { error: result.error };
  }

  redirect("/login?passwordSet=1");
}
