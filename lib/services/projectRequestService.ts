import "server-only";
import { prisma } from "@/lib/db/client";
import {
  projectRequestInputSchema,
  type ProjectRequestInput,
} from "@/lib/validation/projectRequest";
import { normalizeGccPhone } from "@/lib/validation/phone";
import { sendEmail } from "@/lib/email/resend";
import {
  requestConfirmationEmail,
  internalNewRequestEmail,
} from "@/lib/email/templates";
import { getCompanySettings } from "./settingsService";
import { businessTypeLabel } from "@/lib/i18n/labels";
import type { BusinessType } from "@/lib/validation/shared";
import { appUrl } from "@/lib/utils/appUrl";

export type SubmitProjectRequestResult =
  | { ok: true; confirmationEmailSent: boolean }
  | { ok: false; fieldErrors: Record<string, string> }
  | { ok: false; blocked: true };

export async function submitProjectRequest(
  raw: unknown
): Promise<SubmitProjectRequestResult> {
  const parsed = projectRequestInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const input: ProjectRequestInput = parsed.data;

  // Honeypot: bots that fill every visible input trip this hidden field.
  // Silently pretend success without persisting or emailing anything.
  if (input.website && input.website.trim().length > 0) {
    return { ok: false, blocked: true };
  }

  const phoneResult = normalizeGccPhone(input.phoneCountry, input.phoneNumber);
  if (!phoneResult.ok) {
    return { ok: false, fieldErrors: { phoneNumber: phoneResult.error ?? "Invalid phone number." } };
  }

  const request = await prisma.projectRequest.create({
    data: {
      businessType: input.businessType ?? null,
      description: input.description,
      name: input.name,
      businessName: input.businessName,
      email: input.email,
      phoneCountry: input.phoneCountry as ProjectRequestPhoneCountry,
      phoneE164: phoneResult.e164!,
      preferredLocale: input.preferredLocale,
    },
  });

  const settings = await getCompanySettings();

  const confirmation = requestConfirmationEmail(
    input.preferredLocale,
    settings.companyName,
    input.description
  );
  const confirmationState = await sendEmail({
    to: input.email,
    subject: confirmation.subject,
    html: confirmation.html,
  });

  let internalState: "SENT" | "FAILED" = "FAILED";
  const recipients = settings.requestNotificationRecipients;
  if (recipients.length > 0) {
    const internal = internalNewRequestEmail(settings.companyName, {
      name: input.name,
      businessName: input.businessName,
      businessType: input.businessType
        ? businessTypeLabel("en", input.businessType as BusinessType)
        : null,
      email: input.email,
      phone: phoneResult.e164!,
      description: input.description,
      submittedAt: request.createdAt.toISOString(),
      adminUrl: appUrl(`/admin/requests/${request.id}`),
    });
    internalState = await sendEmail({
      to: recipients,
      subject: internal.subject,
      html: internal.html,
    });
  } else {
    console.warn("[projectRequest] No request notification recipients configured.");
  }

  await prisma.projectRequest.update({
    where: { id: request.id },
    data: {
      confirmationEmailState: confirmationState,
      internalEmailState: internalState,
    },
  });

  return { ok: true, confirmationEmailSent: confirmationState === "SENT" };
}

// Local alias to avoid importing the Prisma enum type just for this cast.
type ProjectRequestPhoneCountry = "BH" | "SA" | "AE" | "QA" | "KW" | "OM";
