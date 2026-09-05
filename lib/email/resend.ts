import "server-only";
import { Resend } from "resend";

let client: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
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
}): Promise<EmailDeliveryResult> {
  const resend = getClient();
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resend || !from) {
    console.error("[email] RESEND_API_KEY or RESEND_FROM_EMAIL is not configured; skipping send.");
    return "FAILED";
  }

  try {
    const result = await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (result.error) {
      console.error("[email] Resend returned an error:", result.error);
      return "FAILED";
    }
    return "SENT";
  } catch (err) {
    console.error("[email] Failed to send email:", err);
    return "FAILED";
  }
}
