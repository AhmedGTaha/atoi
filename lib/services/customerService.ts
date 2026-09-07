import "server-only";
import { prisma } from "@/lib/db/client";
import { normalizeGccPhone, type GccCountryCode } from "@/lib/validation/phone";
import { verifyPassword } from "@/lib/auth/password";
import { generateRawToken, hashToken, INVITE_TOKEN_TTL_MS, RESET_TOKEN_TTL_MS } from "@/lib/auth/tokens";
import { sendEmail } from "@/lib/email/resend";
import { customerInvitationEmail, passwordResetEmail } from "@/lib/email/templates";
import { getCompanySettings } from "./settingsService";
import { appUrl } from "@/lib/utils/appUrl";
import type { Locale } from "@/lib/i18n/locale";
import type { Customer } from "@prisma/client";

export interface CustomerUpsertInput {
  name: string | null;
  businessName: string | null;
  email: string;
  phoneCountry: GccCountryCode;
  phoneNumber: string;
  preferredLocale: Locale;
}

export interface FindOrCreateResult {
  customer: Customer;
  createdNew: boolean;
}

/**
 * Looks up a customer by email; if none exists, creates one in INVITED
 * status. Never creates a duplicate for an email that already exists
 * (SRS section 46).
 */
export async function findOrCreateCustomer(
  input: CustomerUpsertInput
): Promise<FindOrCreateResult> {
  const existing = await prisma.customer.findUnique({ where: { email: input.email } });
  if (existing) {
    return { customer: existing, createdNew: false };
  }

  const phone = normalizeGccPhone(input.phoneCountry, input.phoneNumber);
  if (!phone.ok) {
    throw new Error(phone.error ?? "Invalid phone number.");
  }

  const customer = await prisma.customer.create({
    data: {
      name: input.name,
      businessName: input.businessName,
      email: input.email,
      phoneCountry: input.phoneCountry,
      phoneE164: phone.e164!,
      preferredLocale: input.preferredLocale,
      accountStatus: "INVITED",
    },
  });

  return { customer, createdNew: true };
}

export async function updateCustomerContact(
  customerId: string,
  input: { name: string | null; businessName: string | null; phoneCountry: GccCountryCode; phoneNumber: string }
) {
  const phone = normalizeGccPhone(input.phoneCountry, input.phoneNumber);
  if (!phone.ok) throw new Error(phone.error ?? "Invalid phone number.");

  return prisma.customer.update({
    where: { id: customerId },
    data: {
      name: input.name,
      businessName: input.businessName,
      phoneCountry: input.phoneCountry,
      phoneE164: phone.e164!,
    },
  });
}

/**
 * Sends (or resends) the account-setup invitation. Only sent for INVITED
 * customers — an already-active customer never receives a new account
 * setup email (SRS section 46).
 */
export async function sendCustomerInvitation(customerId: string): Promise<"SENT" | "FAILED"> {
  const customer = await prisma.customer.findUniqueOrThrow({ where: { id: customerId } });
  if (customer.accountStatus === "ACTIVE") {
    return "FAILED";
  }

  const rawToken = generateRawToken();
  await prisma.secureToken.create({
    data: {
      customerId,
      type: "CUSTOMER_INVITE",
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
    },
  });

  const settings = await getCompanySettings();
  const email = customerInvitationEmail(
    customer.preferredLocale,
    settings.companyName,
    appUrl(`/set-password?token=${rawToken}`)
  );

  return sendEmail({ to: customer.email, subject: email.subject, html: email.html });
}

export async function requestPasswordReset(email: string): Promise<void> {
  const customer = await prisma.customer.findUnique({ where: { email } });
  // Always behave the same whether or not the account exists, so the form
  // can't be used to enumerate registered emails.
  if (!customer || customer.accountStatus !== "ACTIVE") return;

  const rawToken = generateRawToken();
  await prisma.secureToken.create({
    data: {
      customerId: customer.id,
      type: "PASSWORD_RESET",
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  const settings = await getCompanySettings();
  const email_ = passwordResetEmail(
    customer.preferredLocale,
    settings.companyName,
    appUrl(`/set-password?token=${rawToken}&mode=reset`)
  );
  await sendEmail({ to: customer.email, subject: email_.subject, html: email_.html });
}

export async function authenticateCustomer(
  email: string,
  password: string
): Promise<Customer | null> {
  const customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer || !customer.passwordHash) return null;
  if (customer.accountStatus !== "ACTIVE") return null;

  const valid = await verifyPassword(password, customer.passwordHash);
  return valid ? customer : null;
}

export async function listCustomersForAdmin() {
  return prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { projects: true } } },
  });
}

export async function getCustomerForAdmin(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: { projects: true },
  });
}
