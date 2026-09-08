import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";

const mockSendEmail = vi.fn();
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const { submitProjectRequest } =
  await import("@/lib/services/projectRequestService");
const { deleteProjectRequest } = await import("@/lib/services/requestService");

beforeEach(async () => {
  await resetDatabase();
  mockSendEmail.mockReset();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const validInput = {
  businessType: "retail_online_store",
  name: "Sara",
  businessName: "Sara's Shop",
  description: "I need an online store for my retail business in Manama.",
  email: "sara@example.com",
  phoneCountry: "BH",
  phoneNumber: "36001234",
  preferredLocale: "en",
  website: "",
};

async function seedStaffRecipients() {
  await prisma.adminUser.create({
    data: { name: "Admin", email: "admin@atoi.online", passwordHash: "hash" },
  });
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Team A",
        email: "team-a@atoi.online",
        passwordHash: "hash",
        accountStatus: "ACTIVE",
        isActive: true,
      },
      {
        name: "Team B",
        email: "team-b@atoi.online",
        passwordHash: "hash",
        accountStatus: "ACTIVE",
        isActive: true,
      },
      {
        name: "Duplicate identity safety check",
        email: "admin@atoi.online",
        passwordHash: "hash",
        accountStatus: "ACTIVE",
        isActive: true,
      },
      {
        name: "Inactive",
        email: "inactive@atoi.online",
        passwordHash: "hash",
        accountStatus: "ACTIVE",
        isActive: false,
      },
      {
        name: "Invited",
        email: "invited@atoi.online",
        passwordHash: null,
        accountStatus: "INVITED",
        isActive: true,
      },
    ],
  });
}

describe("submitProjectRequest", () => {
  it("persists once and sends one private email to the customer and every active staff member", async () => {
    await seedStaffRecipients();
    mockSendEmail.mockResolvedValue("SENT");

    const result = await submitProjectRequest(validInput);
    expect(result.ok).toBe(true);
    expect(result).toMatchObject({
      confirmationEmailSent: true,
      teamNotificationSent: true,
    });

    const stored = await prisma.projectRequest.findFirst({
      where: { email: "sara@example.com" },
    });
    expect(stored).not.toBeNull();
    expect(stored?.description).toBe(validInput.description);
    expect(stored?.phoneE164).toBe("+97336001234");
    expect(stored?.state).toBe("NEW");
    expect(stored?.confirmationEmailState).toBe("SENT");
    expect(stored?.internalEmailState).toBe("SENT");
    expect(await prisma.projectRequest.count()).toBe(1);

    expect(mockSendEmail).toHaveBeenCalledTimes(4);
    expect(mockSendEmail.mock.calls[0]?.[0]).toMatchObject({
      to: "sara@example.com",
      context: "request-email/customer confirmation",
    });
    const teamMessages = mockSendEmail.mock.calls
      .slice(1)
      .map(([message]) => message);
    expect(teamMessages.map((message) => message.to)).toEqual(
      expect.arrayContaining([
        "admin@atoi.online",
        "team-a@atoi.online",
        "team-b@atoi.online",
      ]),
    );
    expect(
      teamMessages.every((message) => typeof message.to === "string"),
    ).toBe(true);
    expect(teamMessages.map((message) => message.to)).not.toContain(
      "inactive@atoi.online",
    );
    expect(teamMessages.map((message) => message.to)).not.toContain(
      "invited@atoi.online",
    );
    expect(
      new Set(teamMessages.map((message) => message.idempotencyKey)).size,
    ).toBe(3);
    expect(teamMessages[0]?.html).toContain(`/admin/requests/${stored?.id}`);
  });

  it("still persists the request when Resend fails entirely", async () => {
    mockSendEmail.mockResolvedValue("FAILED");

    const result = await submitProjectRequest(validInput);
    expect(result.ok).toBe(true);
    expect(result).toMatchObject({ ok: true, confirmationEmailSent: false });
    if (result.ok) expect(result.reference).toMatch(/^ATOI-[A-F0-9]{8}$/);

    const stored = await prisma.projectRequest.findFirst({
      where: { email: "sara@example.com" },
    });
    expect(stored).not.toBeNull();
    expect(stored?.confirmationEmailState).toBe("FAILED");
    expect(stored?.internalEmailState).toBe("FAILED");
  });

  it("keeps the request and records a partial team notification failure", async () => {
    await seedStaffRecipients();
    mockSendEmail.mockImplementation(async ({ to }) =>
      to === "team-b@atoi.online" ? "FAILED" : "SENT",
    );

    const result = await submitProjectRequest(validInput);

    expect(result).toMatchObject({
      ok: true,
      confirmationEmailSent: true,
      teamNotificationSent: false,
    });
    const stored = await prisma.projectRequest.findFirstOrThrow({
      where: { email: validInput.email },
    });
    expect(stored.confirmationEmailState).toBe("SENT");
    expect(stored.internalEmailState).toBe("FAILED");
  });

  it("rejects a description shorter than the minimum and does not persist it", async () => {
    const result = await submitProjectRequest({
      ...validInput,
      description: "short",
    });
    expect(result.ok).toBe(false);

    const count = await prisma.projectRequest.count();
    expect(count).toBe(0);
  });

  it("silently drops honeypot submissions without persisting or emailing", async () => {
    mockSendEmail.mockResolvedValue("SENT");

    const result = await submitProjectRequest({
      ...validInput,
      website: "http://spam.example",
    });
    expect(result.ok).toBe(false);

    const count = await prisma.projectRequest.count();
    expect(count).toBe(0);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("normalizes GCC phone numbers to E.164 on write", async () => {
    mockSendEmail.mockResolvedValue("SENT");
    await submitProjectRequest({
      ...validInput,
      phoneCountry: "AE",
      phoneNumber: "501234567",
    });

    const stored = await prisma.projectRequest.findFirst({
      where: { email: "sara@example.com" },
    });
    expect(stored?.phoneE164).toBe("+971501234567");
    expect(stored?.phoneCountry).toBe("AE");
  });

  it("permanently deletes a project request", async () => {
    mockSendEmail.mockResolvedValue("SENT");
    await submitProjectRequest(validInput);
    const stored = await prisma.projectRequest.findFirstOrThrow({
      where: { email: validInput.email },
    });

    await deleteProjectRequest(stored.id);

    await expect(
      prisma.projectRequest.findUnique({ where: { id: stored.id } }),
    ).resolves.toBeNull();
  });
});
