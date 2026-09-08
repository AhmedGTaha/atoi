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
      phoneCountry: "BH",
      phoneE164: "+97312345678",
    },
  });
  return { customer, project };
}

describe("submitSupportRequest", () => {
  it("team member = admin: emails every active admin and team member, regardless of project assignment", async () => {
    const { customer, project } = await seedProject();

    await prisma.adminUser.create({
      data: { name: "Admin", email: "admin@atrio.bh", passwordHash: "hash" },
    });
    // Assigned to the project.
    const memberA = await prisma.teamMember.create({
      data: { name: "A", email: "a@atrio.bh", passwordHash: "hash", accountStatus: "ACTIVE", isActive: true },
    });
    // Not assigned to any project — still notified, since every team member
    // has full admin access now.
    await prisma.teamMember.create({
      data: { name: "B", email: "b@atrio.bh", passwordHash: "hash", accountStatus: "ACTIVE", isActive: true },
    });
    await prisma.teamMember.create({
      data: { name: "C", email: "c@atrio.bh", passwordHash: "hash", accountStatus: "ACTIVE", isActive: false },
    });
    await prisma.projectMember.create({ data: { projectId: project.id, teamMemberId: memberA.id } });

    const result = await submitSupportRequest(project.id, customer.id, "The booking page is showing an error.");
    expect(result.emailSent).toBe(true);

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    const [emailArgs] = mockSendEmail.mock.calls[0]!;
    expect(emailArgs.to).toEqual(expect.arrayContaining(["admin@atrio.bh", "a@atrio.bh", "b@atrio.bh"]));
    expect(emailArgs.to).not.toContain("c@atrio.bh");
    // No duplicates.
    expect(new Set(emailArgs.to).size).toBe(emailArgs.to.length);

    const stored = await prisma.supportRequest.findFirstOrThrow({ where: { projectId: project.id } });
    expect(stored.message).toBe("The booking page is showing an error.");
    expect(stored.emailDeliveryState).toBe("SENT");
  });

  it("persists the request even when there is no active staff to notify", async () => {
    const { customer, project } = await seedProject();

    const result = await submitSupportRequest(project.id, customer.id, "Anyone there?");
    expect(result.emailSent).toBe(false);

    const stored = await prisma.supportRequest.findFirstOrThrow({ where: { projectId: project.id } });
    expect(stored.message).toBe("Anyone there?");
    expect(stored.emailDeliveryState).toBe("FAILED");
  });
});
