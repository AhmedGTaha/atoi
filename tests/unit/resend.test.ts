import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const { sendEmail } = await import("@/lib/email/resend");

beforeEach(() => {
  sendMock.mockReset();
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.RESEND_FROM_EMAIL = "ATOI <hello@atoi.online>";
  vi.spyOn(console, "info").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("sendEmail", () => {
  it("passes a stable idempotency key to Resend and logs the provider message ID", async () => {
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });

    const result = await sendEmail({
      to: "customer@example.com",
      subject: "Confirmation",
      html: "<p>Received</p>",
      context: "request-email/customer confirmation",
      idempotencyKey: "project-request-123-customer-confirmation",
    });

    expect(result).toBe("SENT");
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "ATOI <hello@atoi.online>",
        to: "customer@example.com",
      }),
      { idempotencyKey: "project-request-123-customer-confirmation" },
    );
    expect(console.info).toHaveBeenCalledWith(
      "[email] request-email/customer confirmation sent.",
      { messageId: "email_123" },
    );
  });

  it("fails clearly without calling Resend when provider configuration is invalid", async () => {
    process.env.RESEND_API_KEY = "replace-me";

    const result = await sendEmail({
      to: "customer@example.com",
      subject: "Confirmation",
      html: "<p>Received</p>",
      context: "request-email/customer confirmation",
    });

    expect(result).toBe("FAILED");
    expect(sendMock).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "[email] request-email/customer confirmation failed: RESEND_API_KEY is missing or invalid.",
    );
  });

  it("reports Resend rejection details without throwing", async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: {
        name: "validation_error",
        message: "Sender domain is not verified",
      },
    });

    const result = await sendEmail({
      to: "customer@example.com",
      subject: "Confirmation",
      html: "<p>Received</p>",
      context: "request-email/customer confirmation",
    });

    expect(result).toBe("FAILED");
    expect(console.error).toHaveBeenCalledWith(
      "[email] request-email/customer confirmation failed: Resend rejected the message.",
      {
        name: "validation_error",
        message: "Sender domain is not verified",
      },
    );
  });
});
