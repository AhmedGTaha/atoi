import "server-only";
import { prisma } from "@/lib/db/client";
import { sendEmail } from "@/lib/email/resend";
import { supportNotificationEmail } from "@/lib/email/templates";
import { getCompanySettings } from "./settingsService";
import { listStaffNotificationEmails } from "./staffDirectory";
import { appUrl } from "@/lib/utils/appUrl";

export interface SubmitSupportRequestResult {
  supportRequestId: string;
  emailSent: boolean;
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

  // Team member = Admin: every active admin and team member is notified,
  // not just whoever happens to be assigned to this project.
  const emails = await listStaffNotificationEmails();

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
      data: { emailDeliveryState: state, notifiedFallback: false },
    });
  } else {
    console.error(`[support] No active staff to notify for project ${projectId}.`);
    await prisma.supportRequest.update({
      where: { id: supportRequest.id },
      data: { emailDeliveryState: "FAILED", notifiedFallback: false },
    });
  }

  return { supportRequestId: supportRequest.id, emailSent };
}
