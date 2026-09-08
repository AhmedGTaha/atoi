import { emailShell, escapeHtml } from "./layout";
import { appUrl } from "@/lib/utils/appUrl";
import type { Locale } from "@/lib/i18n/locale";
import { statusLabel } from "@/lib/i18n/labels";
import type { ProjectStatusValue } from "@/lib/validation/shared";

export interface EmailContent {
  subject: string;
  html: string;
}

const COPY = {
  en: {
    requestConfirmationSubject: "We received your project request",
    requestConfirmationHeading: "Thanks for contacting ATOI.",
    requestConfirmationBody: (name: string | null) =>
      `<p>Hi ${escapeHtml(name || "there")},</p>
       <p style="margin-top:16px;">We received your project request and our team will review it shortly.</p>
       <p style="margin-top:16px;">We will get back to you using the contact details you provided.</p>`,
    requestConfirmationCta: (companyName: string) => `Visit ${companyName}`,
    invitationSubject: (companyName: string) =>
      `Set up your ${companyName} customer account`,
    invitationHeading: (companyName: string) =>
      `You've been invited to ${companyName}.`,
    invitationBody: (companyName: string) =>
      `<p>A ${escapeHtml(companyName)} team member has created a project for you. Set a password to access your customer portal and follow your project's progress.</p>`,
    invitationCta: "Set password",
    resetSubject: (companyName: string) => `Reset your ${companyName} password`,
    resetHeading: "Reset your password.",
    resetBody:
      "<p>We received a request to reset your password. If you didn't request this, you can safely ignore this email.</p>",
    resetCta: "Reset password",
    updateSubject: (projectName: string) => `Project update: ${projectName}`,
    updateHeading: "Your project has an update.",
    updateBody: (
      projectName: string,
      body: string,
      status: string,
      progress: number,
    ) =>
      `<p><strong>${escapeHtml(projectName)}</strong></p>
       <p style="margin-top:12px;">${escapeHtml(body)}</p>
       <p class="email-status" style="margin-top:18px;padding-top:14px;border-top:1px solid #D8DEE3;color:#414B55;font-family:'Courier New',Courier,monospace;font-size:12px;">Status: <span class="email-accent" style="color:#0A6577;">${escapeHtml(status)}</span> · Progress: <span class="email-value" style="color:#0F1418;">${progress}%</span></p>`,
    updateCta: "View project",
    internalRequestSubject: (requester: string) =>
      `New project request from ${requester}`,
    internalRequestHeading: "New project request received.",
    supportSubject: (projectName: string) => `Support request: ${projectName}`,
    supportHeading: "New support request.",
    teamInvitationSubject: (companyName: string) =>
      `Set up your ${companyName} team account`,
    teamInvitationHeading: (companyName: string) =>
      `You've been invited to the ${companyName} team.`,
    teamInvitationBody:
      "<p>An admin has added you as a team member. Set a password to activate your account — you'll be signed in automatically once it's set.</p>",
    teamInvitationCta: "Set password & sign in",
  },
  ar: {
    requestConfirmationSubject: "لقد استلمنا طلبك",
    requestConfirmationHeading: "شكراً لتواصلك معنا.",
    requestConfirmationBody: (name: string | null) =>
      `<p>مرحباً ${escapeHtml(name || "بك")}،</p>
       <p style="margin-top:16px;">لقد استلمنا طلب مشروعك وسيقوم فريقنا بمراجعته قريباً.</p>
       <p style="margin-top:16px;">سنتواصل معك باستخدام بيانات الاتصال التي قدمتها.</p>`,
    requestConfirmationCta: (companyName: string) => `زيارة ${companyName}`,
    invitationSubject: (companyName: string) =>
      `قم بإعداد حساب العميل الخاص بك في ${companyName}`,
    invitationHeading: (companyName: string) => `تمت دعوتك إلى ${companyName}.`,
    invitationBody: (companyName: string) =>
      `<p>قام أحد أعضاء فريق ${escapeHtml(companyName)} بإنشاء مشروع لك. قم بتعيين كلمة مرور للوصول إلى بوابة العملاء الخاصة بك ومتابعة تقدم مشروعك.</p>`,
    invitationCta: "تعيين كلمة المرور",
    resetSubject: (companyName: string) =>
      `إعادة تعيين كلمة مرور ${companyName}`,
    resetHeading: "إعادة تعيين كلمة المرور.",
    resetBody:
      "<p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.</p>",
    resetCta: "إعادة تعيين كلمة المرور",
    updateSubject: (projectName: string) => `تحديث المشروع: ${projectName}`,
    updateHeading: "لديك تحديث جديد على مشروعك.",
    updateBody: (
      projectName: string,
      body: string,
      status: string,
      progress: number,
    ) =>
      `<p><strong>${escapeHtml(projectName)}</strong></p>
       <p style="margin-top:12px;">${escapeHtml(body)}</p>
       <p class="email-status" style="margin-top:18px;padding-top:14px;border-top:1px solid #D8DEE3;color:#414B55;font-family:'Courier New',Courier,monospace;font-size:12px;">الحالة: <span class="email-accent" style="color:#0A6577;">${escapeHtml(status)}</span> · نسبة الإنجاز: <span class="email-value" style="color:#0F1418;">${progress}%</span></p>`,
    updateCta: "عرض المشروع",
    internalRequestSubject: "طلب مشروع جديد",
    internalRequestHeading: "تم استلام طلب مشروع جديد.",
    supportSubject: (projectName: string) => `طلب دعم: ${projectName}`,
    supportHeading: "طلب دعم جديد.",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export function requestConfirmationEmail(
  locale: Locale,
  companyName: string,
  customerName: string | null,
): EmailContent {
  const c = COPY[locale];
  return {
    subject: c.requestConfirmationSubject,
    html: emailShell({
      locale,
      companyName,
      heading: c.requestConfirmationHeading,
      bodyHtml: c.requestConfirmationBody(customerName),
      ctaUrl: appUrl("/"),
      ctaLabel: c.requestConfirmationCta(companyName),
    }),
  };
}

export function customerInvitationEmail(
  locale: Locale,
  companyName: string,
  setupUrl: string,
): EmailContent {
  const c = COPY[locale];
  return {
    subject: c.invitationSubject(companyName),
    html: emailShell({
      locale,
      companyName,
      heading: c.invitationHeading(companyName),
      bodyHtml: c.invitationBody(companyName),
      ctaUrl: setupUrl,
      ctaLabel: c.invitationCta,
    }),
  };
}

/** Team member invitations are internal, so always sent in English. */
export function teamMemberInvitationEmail(
  companyName: string,
  setupUrl: string,
): EmailContent {
  const c = COPY.en;
  return {
    subject: c.teamInvitationSubject(companyName),
    html: emailShell({
      locale: "en",
      companyName,
      heading: c.teamInvitationHeading(companyName),
      bodyHtml: c.teamInvitationBody,
      ctaUrl: setupUrl,
      ctaLabel: c.teamInvitationCta,
    }),
  };
}

export function passwordResetEmail(
  locale: Locale,
  companyName: string,
  resetUrl: string,
): EmailContent {
  const c = COPY[locale];
  return {
    subject: c.resetSubject(companyName),
    html: emailShell({
      locale,
      companyName,
      heading: c.resetHeading,
      bodyHtml: c.resetBody,
      ctaUrl: resetUrl,
      ctaLabel: c.resetCta,
    }),
  };
}

export function projectUpdateEmail(
  locale: Locale,
  companyName: string,
  projectName: string,
  body: string,
  status: ProjectStatusValue,
  progress: number,
  portalUrl: string,
): EmailContent {
  const c = COPY[locale];
  return {
    subject: c.updateSubject(projectName),
    html: emailShell({
      locale,
      companyName,
      heading: c.updateHeading,
      bodyHtml: c.updateBody(
        projectName,
        body,
        statusLabel(locale, status),
        progress,
      ),
      ctaUrl: portalUrl,
      ctaLabel: c.updateCta,
    }),
  };
}

/** Internal emails (to the ATOI team) are always sent in English. */
export function internalNewRequestEmail(
  companyName: string,
  fields: {
    name: string | null;
    businessName: string | null;
    businessType: string | null;
    email: string;
    phone: string;
    description: string;
    submittedAt: string;
    adminUrl: string;
  },
): EmailContent {
  const c = COPY.en;
  const rows = [
    ["Name", fields.name ?? "—"],
    ["Business name", fields.businessName ?? "—"],
    ["Business type", fields.businessType ?? "—"],
    ["Email", fields.email],
    ["Phone", fields.phone],
    ["Submitted", fields.submittedAt],
  ]
    .map(
      ([label, value]) =>
        `<tr><td class="email-label" style="padding:7px 16px 7px 0;color:#414B55;font-family:'Courier New',Courier,monospace;font-size:12px;">${escapeHtml(label)}</td><td class="email-value" style="padding:7px 0;color:#0F1418;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return {
    subject: c.internalRequestSubject(
      sanitizeSubject(fields.name || fields.businessName || fields.email),
    ),
    html: emailShell({
      locale: "en",
      companyName,
      heading: c.internalRequestHeading,
      bodyHtml: `<table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
                 <p class="email-accent" style="margin:20px 0 10px;font-family:'Courier New',Courier,monospace;font-size:12px;color:#0A6577;">DESCRIPTION</p>
                 <p class="email-quote" style="margin:0;padding:16px;border-left:2px solid #0A6577;background:#F5F7F8;color:#0F1418;">${escapeHtml(fields.description)}</p>`,
      ctaUrl: fields.adminUrl,
      ctaLabel: "Open request",
    }),
  };
}

function sanitizeSubject(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Support notification emails (to the internal team) are always in English. */
export function supportNotificationEmail(
  companyName: string,
  fields: {
    projectName: string;
    customerLabel: string;
    message: string;
    adminUrl: string;
  },
): EmailContent {
  const c = COPY.en;
  return {
    subject: c.supportSubject(fields.projectName),
    html: emailShell({
      locale: "en",
      companyName,
      heading: c.supportHeading,
      bodyHtml: `<p class="email-value" style="color:#0F1418;"><strong>${escapeHtml(fields.projectName)}</strong> — ${escapeHtml(fields.customerLabel)}</p>
                 <p class="email-quote" style="margin-top:18px;padding:16px;border-left:2px solid #0A6577;background:#F5F7F8;color:#0F1418;">${escapeHtml(fields.message)}</p>`,
      ctaUrl: fields.adminUrl,
      ctaLabel: "Open project",
    }),
  };
}
