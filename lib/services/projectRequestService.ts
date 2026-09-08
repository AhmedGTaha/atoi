import "server-only";
import { createHash } from "node:crypto";
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
import { listStaffNotificationEmails } from "./staffDirectory";
import { businessTypeLabel } from "@/lib/i18n/labels";
import type { BusinessType } from "@/lib/validation/shared";
import { appUrl } from "@/lib/utils/appUrl";

export type SubmitProjectRequestResult =
  | {
      ok: true;
      confirmationEmailSent: boolean;
      teamNotificationSent: boolean;
      reference: string;
    }
  | { ok: false; fieldErrors: Record<string, string> }
  | { ok: false; blocked: true };

export async function submitProjectRequest(
  raw: unknown,
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
    return {
      ok: false,
      fieldErrors: {
        phoneNumber: phoneResult.error ?? "Invalid phone number.",
      },
    };
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
    input.name,
  );
  const confirmationState = await sendEmail({
    to: input.email,
    subject: confirmation.subject,
    html: confirmation.html,
    context: "request-email/customer confirmation",
    idempotencyKey: `project-request-${request.id}-customer-confirmation`,
  });
  if (confirmationState === "FAILED") {
    console.error("[request-email] customer confirmation failed.", {
      requestId: request.id,
    });
  }

  let internalState: "SENT" | "FAILED" = "FAILED";
  // Team member = Admin: notify every active admin and team member, not a
  // hand-configured recipient list.
  const recipients = await listStaffNotificationEmails();
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
    const results = await Promise.all(
      recipients.map((recipient) =>
        sendEmail({
          to: recipient,
          subject: internal.subject,
          html: internal.html,
          context: "request-email/team notification",
          idempotencyKey: `project-request-${request.id}-team-${recipientKey(recipient)}`,
        }),
      ),
    );
    const failedCount = results.filter((result) => result === "FAILED").length;
    internalState = failedCount === 0 ? "SENT" : "FAILED";
    if (failedCount > 0) {
      console.error("[request-email] team notification failed.", {
        requestId: request.id,
        failedCount,
        recipientCount: recipients.length,
      });
    }
  } else {
    console.error("[request-email] no active team recipients found.", {
      requestId: request.id,
    });
  }

  await prisma.projectRequest.update({
    where: { id: request.id },
    data: {
      confirmationEmailState: confirmationState,
      internalEmailState: internalState,
    },
  });

  const reference = `ATOI-${request.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
  return {
    ok: true,
    confirmationEmailSent: confirmationState === "SENT",
    teamNotificationSent: internalState === "SENT",
    reference,
  };
}

function recipientKey(email: string): string {
  return createHash("sha256").update(email).digest("hex").slice(0, 24);
}

// Local alias to avoid importing the Prisma enum type just for this cast.
type ProjectRequestPhoneCountry = "BH" | "SA" | "AE" | "QA" | "KW" | "OM";
