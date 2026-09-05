import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";

const mockSendEmail = vi.fn().mockResolvedValue("SENT");
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const { convertRequestToProject } = await import("@/lib/services/projectService");

beforeEach(async () => {
  await resetDatabase();
  mockSendEmail.mockClear();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function createRequest(email: string) {
  return prisma.projectRequest.create({
    data: {
      description: "Need a booking system for my salon.",
      email,
      phoneCountry: "BH",
      phoneE164: "+97336001234",
      preferredLocale: "en",
    },
  });
}

describe("convertRequestToProject", () => {
  it("creates a customer and project, and sends a customer invitation", async () => {
    const request = await createRequest("new-customer@example.com");

    const result = await convertRequestToProject({
      requestId: request.id,
      projectName: "Salon Booking System",
      description: request.description,
      customerName: "Fatima",
      businessName: "Bloom Salon",
      email: request.email,
      phoneCountry: "BH",
      phoneNumber: "36001234",
      memberIds: [],
    });

    expect(result.customerCreated).toBe(true);
    expect(result.invitationEmailSent).toBe(true);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);

    const customer = await prisma.customer.findUniqueOrThrow({ where: { id: result.customerId } });
    expect(customer.accountStatus).toBe("INVITED");
    expect(customer.email).toBe("new-customer@example.com");

    const project = await prisma.project.findUniqueOrThrow({ where: { id: result.projectId } });
    expect(project.status).toBe("PENDING_TEAM_APPROVAL");
    expect(project.progress).toBe(0);

    const updatedRequest = await prisma.projectRequest.findUniqueOrThrow({ where: { id: request.id } });
    expect(updatedRequest.state).toBe("CONVERTED");
    expect(updatedRequest.convertedCustomerId).toBe(result.customerId);
  });

  it("does not create a duplicate customer for an email that already exists", async () => {
    const firstRequest = await createRequest("repeat@example.com");
    const first = await convertRequestToProject({
      requestId: firstRequest.id,
      projectName: "First project",
      description: "First project description here.",
      customerName: "Ali",
      businessName: null,
      email: "repeat@example.com",
      phoneCountry: "BH",
      phoneNumber: "36001234",
      memberIds: [],
    });

    // Customer accepts the invite and becomes ACTIVE before a second request arrives.
    await prisma.customer.update({
      where: { id: first.customerId },
      data: { accountStatus: "ACTIVE", passwordHash: "irrelevant-hash" },
    });
    mockSendEmail.mockClear();

    const secondRequest = await createRequest("repeat@example.com");
    const second = await convertRequestToProject({
      requestId: secondRequest.id,
      projectName: "Second project",
      description: "Second project description here.",
      customerName: "Ali",
      businessName: null,
      email: "repeat@example.com",
      phoneCountry: "BH",
      phoneNumber: "36001234",
      memberIds: [],
    });

    expect(second.customerCreated).toBe(false);
    expect(second.customerId).toBe(first.customerId);

    const customerCount = await prisma.customer.count({ where: { email: "repeat@example.com" } });
    expect(customerCount).toBe(1);

    const projectCount = await prisma.project.count({ where: { customerId: first.customerId } });
    expect(projectCount).toBe(2);

    // An already-active customer must never get a second invitation email.
    expect(second.invitationEmailSent).toBe(false);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});
