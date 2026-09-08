import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !apiKey.startsWith("re_")) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

export type EmailDeliveryResult = "SENT" | "FAILED";

/**
 * Sends one email via Resend. Never throws — callers (project requests,
 * project updates, support requests) must persist their record regardless
 * of email outcome, so failures are logged and reported back as a status
 * instead of propagating.
 */
export async function sendEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
  context?: string;
  idempotencyKey?: string;
}): Promise<EmailDeliveryResult> {
  const resend = getClient();
  const from = process.env.RESEND_FROM_EMAIL;
  const context = params.context ?? "email";
  const recipients = Array.isArray(params.to) ? params.to : [params.to];

  if (!resend) {
    console.error(
      `[email] ${context} failed: RESEND_API_KEY is missing or invalid.`,
    );
    return "FAILED";
  }
  if (!from) {
    console.error(
      `[email] ${context} failed: RESEND_FROM_EMAIL is not configured.`,
    );
    return "FAILED";
  }
  if (!senderHasValidEmail(from)) {
    console.error(
      `[email] ${context} failed: RESEND_FROM_EMAIL is not a valid sender address.`,
    );
    return "FAILED";
  }
  if (
    recipients.length === 0 ||
    recipients.some((recipient) => !isValidEmail(recipient))
  ) {
    console.error(
      `[email] ${context} failed: one or more recipients are invalid.`,
      {
        recipientCount: recipients.length,
      },
    );
    return "FAILED";
  }

  try {
    const result = await resend.emails.send(
      {
        from,
        to: params.to,
        subject: params.subject,
        html: params.html,
      },
      params.idempotencyKey
        ? { idempotencyKey: params.idempotencyKey }
        : undefined,
    );

    if (result.error) {
      console.error(`[email] ${context} failed: Resend rejected the message.`, {
        name: result.error.name,
        message: result.error.message,
      });
      return "FAILED";
    }

    console.info(`[email] ${context} sent.`, { messageId: result.data?.id });
    return "SENT";
  } catch (err) {
    console.error(`[email] ${context} failed: provider request threw.`, {
      message: err instanceof Error ? err.message : "Unknown provider error",
    });
    return "FAILED";
  }
}

function senderHasValidEmail(value: string): boolean {
  const match = value.match(/(?:^|<)([^<>\s]+@[^<>\s]+)>?$/);
  return match ? isValidEmail(match[1]) : false;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
