import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";

const mockSendEmail = vi.fn();
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const { submitSupportRequest } = await import("@/lib/services/supportService");

beforeEach(async () => {
  await resetDatabase();
  mockSendEmail.mockReset();
  mockSendEmail.mockResolvedValue("SENT");
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function seedProject() {
  const customer = await prisma.customer.create({
    data: {
      email: "customer@example.com",
      phoneCountry: "BH",
      phoneE164: "+97336001234",
      accountStatus: "ACTIVE",
      passwordHash: "hash",
    },
  });
  const project = await prisma.project.create({
    data: {
      customerId: customer.id,
      name: "Booking System",
      description: "A booking system.",
      status: "DEVELOPMENT",
      progress: 40,
    },
  });
  return { customer, project };
}

describe("submitSupportRequest", () => {
  it("persists the request and emails every active assigned project member", async () => {
    const { customer, project } = await seedProject();

    const memberA = await prisma.teamMember.create({ data: { name: "A", email: "a@atrio.bh", isActive: true } });
    const memberB = await prisma.teamMember.create({ data: { name: "B", email: "b@atrio.bh", isActive: true } });
    const inactiveMember = await prisma.teamMember.create({
      data: { name: "C", email: "c@atrio.bh", isActive: false },
    });
    await prisma.projectMember.createMany({
      data: [
        { projectId: project.id, teamMemberId: memberA.id },
        { projectId: project.id, teamMemberId: memberB.id },
        { projectId: project.id, teamMemberId: inactiveMember.id },
      ],
    });

    const result = await submitSupportRequest(project.id, customer.id, "The booking page is showing an error.");
    expect(result.emailSent).toBe(true);
    expect(result.usedFallback).toBe(false);

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    const [emailArgs] = mockSendEmail.mock.calls[0]!;
    // Every active member is included; the inactive member is excluded.
    expect(emailArgs.to).toEqual(expect.arrayContaining(["a@atrio.bh", "b@atrio.bh"]));
    expect(emailArgs.to).not.toContain("c@atrio.bh");

    const stored = await prisma.supportRequest.findFirstOrThrow({ where: { projectId: project.id } });
    expect(stored.message).toBe("The booking page is showing an error.");
    expect(stored.emailDeliveryState).toBe("SENT");
  });

  it("falls back to configured support recipients when no active members are assigned", async () => {
    const { customer, project } = await seedProject();
    await prisma.companySettings.create({
      data: {
        companyName: "Atrio",
        companyEmail: "hello@atrio.bh",
        companyPhone: "+973 1 000 0000",
        locationEn: "Manama",
        locationAr: "المنامة",
        requestNotificationRecipients: [],
        supportFallbackRecipients: ["fallback@atrio.bh"],
        seoTitleEn: "t",
        seoTitleAr: "t",
        seoDescriptionEn: "d",
        seoDescriptionAr: "d",
      },
    });

    const result = await submitSupportRequest(project.id, customer.id, "Need help urgently.");
    expect(result.usedFallback).toBe(true);
    expect(result.emailSent).toBe(true);

    const [emailArgs] = mockSendEmail.mock.calls[0]!;
    expect(emailArgs.to).toEqual(["fallback@atrio.bh"]);

    const stored = await prisma.supportRequest.findFirstOrThrow({ where: { projectId: project.id } });
    expect(stored.notifiedFallback).toBe(true);
  });

  it("persists the request even when no recipients (not even fallback) are configured", async () => {
    const { customer, project } = await seedProject();

    const result = await submitSupportRequest(project.id, customer.id, "Anyone there?");
    expect(result.emailSent).toBe(false);

    const stored = await prisma.supportRequest.findFirstOrThrow({ where: { projectId: project.id } });
    expect(stored.message).toBe("Anyone there?");
    expect(stored.emailDeliveryState).toBe("FAILED");
  });
});
