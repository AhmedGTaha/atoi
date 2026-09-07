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
    requestConfirmationSubject: "We've received your request",
    requestConfirmationHeading: "Thanks for reaching out.",
    requestConfirmationBody: (description: string) =>
      `<p>We've received your project request and our team will review it shortly.</p>
       <p style="margin-top:16px;padding:16px;background:#F5F5F7;border-radius:12px;color:#333;">
         ${escapeHtml(description)}
       </p>
       <p style="margin-top:16px;">We'll be in touch soon.</p>`,
    requestConfirmationCta: (companyName: string) => `Visit ${companyName}`,
    invitationSubject: (companyName: string) => `Set up your ${companyName} customer account`,
    invitationHeading: (companyName: string) => `You've been invited to ${companyName}.`,
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
      progress: number
    ) =>
      `<p><strong>${escapeHtml(projectName)}</strong></p>
       <p style="margin-top:12px;">${escapeHtml(body)}</p>
       <p style="margin-top:16px;color:#555;">Status: ${escapeHtml(status)} · Progress: ${progress}%</p>`,
    updateCta: "View project",
    internalRequestSubject: "New project request",
    internalRequestHeading: "New project request received.",
    supportSubject: (projectName: string) => `Support request: ${projectName}`,
    supportHeading: "New support request.",
    teamInvitationSubject: (companyName: string) => `Set up your ${companyName} team account`,
    teamInvitationHeading: (companyName: string) => `You've been invited to the ${companyName} team.`,
    teamInvitationBody:
      "<p>An admin has added you as a team member. Set a password to activate your account — you'll be signed in automatically once it's set.</p>",
    teamInvitationCta: "Set password & sign in",
  },
  ar: {
    requestConfirmationSubject: "لقد استلمنا طلبك",
    requestConfirmationHeading: "شكراً لتواصلك معنا.",
    requestConfirmationBody: (description: string) =>
      `<p>لقد استلمنا طلب مشروعك وسيقوم فريقنا بمراجعته قريباً.</p>
       <p style="margin-top:16px;padding:16px;background:#F5F5F7;border-radius:12px;color:#333;">
         ${escapeHtml(description)}
       </p>
       <p style="margin-top:16px;">سنتواصل معك قريباً.</p>`,
    requestConfirmationCta: (companyName: string) => `زيارة ${companyName}`,
    invitationSubject: (companyName: string) => `قم بإعداد حساب العميل الخاص بك في ${companyName}`,
    invitationHeading: (companyName: string) => `تمت دعوتك إلى ${companyName}.`,
    invitationBody: (companyName: string) =>
      `<p>قام أحد أعضاء فريق ${escapeHtml(companyName)} بإنشاء مشروع لك. قم بتعيين كلمة مرور للوصول إلى بوابة العملاء الخاصة بك ومتابعة تقدم مشروعك.</p>`,
    invitationCta: "تعيين كلمة المرور",
    resetSubject: (companyName: string) => `إعادة تعيين كلمة مرور ${companyName}`,
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
      progress: number
    ) =>
      `<p><strong>${escapeHtml(projectName)}</strong></p>
       <p style="margin-top:12px;">${escapeHtml(body)}</p>
       <p style="margin-top:16px;color:#555;">الحالة: ${escapeHtml(status)} · نسبة الإنجاز: ${progress}%</p>`,
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
  description: string
): EmailContent {
  const c = COPY[locale];
  return {
    subject: c.requestConfirmationSubject,
    html: emailShell({
      locale,
      companyName,
      heading: c.requestConfirmationHeading,
      bodyHtml: c.requestConfirmationBody(description),
      ctaUrl: appUrl("/"),
      ctaLabel: c.requestConfirmationCta(companyName),
    }),
  };
}

export function customerInvitationEmail(
  locale: Locale,
  companyName: string,
  setupUrl: string
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
export function teamMemberInvitationEmail(companyName: string, setupUrl: string): EmailContent {
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
  resetUrl: string
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
  portalUrl: string
): EmailContent {
  const c = COPY[locale];
  return {
    subject: c.updateSubject(projectName),
    html: emailShell({
      locale,
      companyName,
      heading: c.updateHeading,
      bodyHtml: c.updateBody(projectName, body, statusLabel(locale, status), progress),
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
  }
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
        `<tr><td style="padding:4px 12px 4px 0;color:#777;">${escapeHtml(label)}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return {
    subject: c.internalRequestSubject,
    html: emailShell({
      locale: "en",
      companyName,
      heading: c.internalRequestHeading,
      bodyHtml: `<table style="border-collapse:collapse;font-size:14px;">${rows}</table>
                 <p style="margin-top:16px;"><strong>Description</strong></p>
                 <p style="padding:16px;background:#F5F5F7;border-radius:12px;color:#333;">${escapeHtml(fields.description)}</p>`,
      ctaUrl: fields.adminUrl,
      ctaLabel: "Open request",
    }),
  };
}

/** Support notification emails (to the internal team) are always in English. */
export function supportNotificationEmail(
  companyName: string,
  fields: {
    projectName: string;
    customerLabel: string;
    message: string;
    adminUrl: string;
  }
): EmailContent {
  const c = COPY.en;
  return {
    subject: c.supportSubject(fields.projectName),
    html: emailShell({
      locale: "en",
      companyName,
      heading: c.supportHeading,
      bodyHtml: `<p><strong>${escapeHtml(fields.projectName)}</strong> — ${escapeHtml(fields.customerLabel)}</p>
                 <p style="margin-top:16px;padding:16px;background:#F5F5F7;border-radius:12px;color:#333;">${escapeHtml(fields.message)}</p>`,
      ctaUrl: fields.adminUrl,
      ctaLabel: "Open project",
    }),
  };
}
