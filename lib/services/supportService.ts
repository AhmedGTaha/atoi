import "server-only";
import { prisma } from "@/lib/db/client";
import { sendEmail } from "@/lib/email/resend";
import { supportNotificationEmail } from "@/lib/email/templates";
import { getCompanySettings } from "./settingsService";
import { appUrl } from "@/lib/utils/appUrl";

export interface SubmitSupportRequestResult {
  supportRequestId: string;
  emailSent: boolean;
  usedFallback: boolean;
}

/**
 * Resolves who should be notified for a project's support request: every
 * active team member currently assigned to the project. If none are
 * assigned, falls back to the configured support fallback recipients and
 * logs the gap (SRS section 40).
 */
export async function resolveSupportRecipients(
  projectId: string
): Promise<{ emails: string[]; usedFallback: boolean }> {
  const members = await prisma.projectMember.findMany({
    where: { projectId, teamMember: { isActive: true } },
    include: { teamMember: true },
  });

  const emails = members.map((m) => m.teamMember.email);
  if (emails.length > 0) {
    return { emails, usedFallback: false };
  }

  console.warn(`[support] Project ${projectId} has no active assigned members; using fallback recipients.`);
  const settings = await getCompanySettings();
  return { emails: settings.supportFallbackRecipients, usedFallback: true };
}

export async function submitSupportRequest(
  projectId: string,
  customerId: string,
  message: string
): Promise<SubmitSupportRequestResult> {
  const project = await prisma.project.findFirstOrThrow({
    where: { id: projectId, customerId },
    include: { customer: true },
  });

  const supportRequest = await prisma.supportRequest.create({
    data: { projectId, customerId, message },
  });

  const { emails, usedFallback } = await resolveSupportRecipients(projectId);

  let emailSent = false;
  if (emails.length > 0) {
    const settings = await getCompanySettings();
    const email = supportNotificationEmail(settings.companyName, {
      projectName: project.name,
      customerLabel: project.customer.businessName || project.customer.name || project.customer.email,
      message,
      adminUrl: appUrl(`/admin/projects/${project.id}`),
    });
    const state = await sendEmail({ to: emails, subject: email.subject, html: email.html });
    emailSent = state === "SENT";

    await prisma.supportRequest.update({
      where: { id: supportRequest.id },
      data: { emailDeliveryState: state, notifiedFallback: usedFallback },
    });
  } else {
    console.error(`[support] No recipients (not even fallback) configured for project ${projectId}.`);
    await prisma.supportRequest.update({
      where: { id: supportRequest.id },
      data: { emailDeliveryState: "FAILED", notifiedFallback: usedFallback },
    });
  }

  return { supportRequestId: supportRequest.id, emailSent, usedFallback };
}
