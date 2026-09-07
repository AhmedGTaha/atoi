import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";

const mockSendEmail = vi.fn();
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const { submitProjectRequest } = await import("@/lib/services/projectRequestService");

beforeEach(async () => {
  await resetDatabase();
  mockSendEmail.mockReset();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const validInput = {
  businessType: "retail",
  name: "Sara",
  businessName: "Sara's Shop",
  description: "I need an online store for my retail business in Manama.",
  email: "sara@example.com",
  phoneCountry: "BH",
  phoneNumber: "36001234",
  preferredLocale: "en",
  website: "",
};

describe("submitProjectRequest", () => {
  it("persists the request to PostgreSQL when emails succeed", async () => {
    mockSendEmail.mockResolvedValue("SENT");

    const result = await submitProjectRequest(validInput);
    expect(result.ok).toBe(true);

    const stored = await prisma.projectRequest.findFirst({ where: { email: "sara@example.com" } });
    expect(stored).not.toBeNull();
    expect(stored?.description).toBe(validInput.description);
    expect(stored?.phoneE164).toBe("+97336001234");
    expect(stored?.state).toBe("NEW");
    expect(stored?.confirmationEmailState).toBe("SENT");
  });

  it("still persists the request when Resend fails entirely", async () => {
    mockSendEmail.mockResolvedValue("FAILED");

    const result = await submitProjectRequest(validInput);
    expect(result.ok).toBe(true);
    expect(result).toMatchObject({ ok: true, confirmationEmailSent: false });
    if (result.ok) expect(result.reference).toMatch(/^ATOI-[A-F0-9]{8}$/);

    const stored = await prisma.projectRequest.findFirst({ where: { email: "sara@example.com" } });
    expect(stored).not.toBeNull();
    expect(stored?.confirmationEmailState).toBe("FAILED");
  });

  it("rejects a description shorter than the minimum and does not persist it", async () => {
    const result = await submitProjectRequest({ ...validInput, description: "short" });
    expect(result.ok).toBe(false);

    const count = await prisma.projectRequest.count();
    expect(count).toBe(0);
  });

  it("silently drops honeypot submissions without persisting or emailing", async () => {
    mockSendEmail.mockResolvedValue("SENT");

    const result = await submitProjectRequest({ ...validInput, website: "http://spam.example" });
    expect(result.ok).toBe(false);

    const count = await prisma.projectRequest.count();
    expect(count).toBe(0);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("normalizes GCC phone numbers to E.164 on write", async () => {
    mockSendEmail.mockResolvedValue("SENT");
    await submitProjectRequest({ ...validInput, phoneCountry: "AE", phoneNumber: "501234567" });

    const stored = await prisma.projectRequest.findFirst({ where: { email: "sara@example.com" } });
    expect(stored?.phoneE164).toBe("+971501234567");
    expect(stored?.phoneCountry).toBe("AE");
  });
});
