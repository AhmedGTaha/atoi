import { emailShell, escapeHtml } from "./layout";
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
       <p style="margin-top:16px;padding:16px;background:#F0EBE5;border-radius:12px;color:#333;">
         ${escapeHtml(description)}
       </p>
       <p style="margin-top:16px;">We'll be in touch soon.</p>`,
    invitationSubject: "Set up your Atrio customer account",
    invitationHeading: "You've been invited to Atrio.",
    invitationBody:
      "<p>An Atrio team member has created a project for you. Set a password to access your customer portal and follow your project's progress.</p>",
    invitationCta: "Set your password",
    resetSubject: "Reset your Atrio password",
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
    updateCta: "View in portal",
    internalRequestSubject: "New project request",
    internalRequestHeading: "New project request received.",
    supportSubject: (projectName: string) => `Support request: ${projectName}`,
    supportHeading: "New support request.",
  },
  ar: {
    requestConfirmationSubject: "لقد استلمنا طلبك",
    requestConfirmationHeading: "شكراً لتواصلك معنا.",
    requestConfirmationBody: (description: string) =>
      `<p>لقد استلمنا طلب مشروعك وسيقوم فريقنا بمراجعته قريباً.</p>
       <p style="margin-top:16px;padding:16px;background:#F0EBE5;border-radius:12px;color:#333;">
         ${escapeHtml(description)}
       </p>
       <p style="margin-top:16px;">سنتواصل معك قريباً.</p>`,
    invitationSubject: "قم بإعداد حساب العميل الخاص بك في أتريو",
    invitationHeading: "تمت دعوتك إلى أتريو.",
    invitationBody:
      "<p>قام أحد أعضاء فريق أتريو بإنشاء مشروع لك. قم بتعيين كلمة مرور للوصول إلى بوابة العملاء الخاصة بك ومتابعة تقدم مشروعك.</p>",
    invitationCta: "تعيين كلمة المرور",
    resetSubject: "إعادة تعيين كلمة مرور أتريو",
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
    updateCta: "عرض في البوابة",
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
    subject: c.invitationSubject,
    html: emailShell({
      locale,
      companyName,
      heading: c.invitationHeading,
      bodyHtml: c.invitationBody,
      ctaUrl: setupUrl,
      ctaLabel: c.invitationCta,
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
    subject: c.resetSubject,
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

/** Internal emails (to the Atrio team) are always sent in English. */
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
                 <p style="padding:16px;background:#F0EBE5;border-radius:12px;color:#333;">${escapeHtml(fields.description)}</p>`,
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
                 <p style="margin-top:16px;padding:16px;background:#F0EBE5;border-radius:12px;color:#333;">${escapeHtml(fields.message)}</p>`,
      ctaUrl: fields.adminUrl,
      ctaLabel: "Open project",
    }),
  };
}
