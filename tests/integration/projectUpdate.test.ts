import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";

const mockSendEmail = vi.fn();
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const { publishProjectUpdate } = await import("@/lib/services/projectService");

beforeEach(async () => {
  await resetDatabase();
  mockSendEmail.mockReset();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function seedProjectWithAdmin() {
  const admin = await prisma.adminUser.create({
    data: { name: "Admin One", email: "admin@atrio.bh", passwordHash: "hash" },
  });
  const teamMember = await prisma.teamMember.create({
    data: {
      name: "Team One",
      email: "team@atrio.bh",
      passwordHash: "hash",
      accountStatus: "ACTIVE",
    },
  });
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
  return { admin, teamMember, customer, project };
}

describe("publishProjectUpdate", () => {
  it("persists the update with a status/progress snapshot and emails the customer", async () => {
    mockSendEmail.mockResolvedValue("SENT");
    const { admin, project } = await seedProjectWithAdmin();

    const result = await publishProjectUpdate(
      project.id,
      { kind: "admin", id: admin.id },
      "We finished the booking calendar.",
    );
    expect(result.emailSent).toBe(true);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    const [emailArgs] = mockSendEmail.mock.calls[0]!;
    expect(emailArgs.to).toBe("customer@example.com");

    const update = await prisma.projectUpdate.findFirstOrThrow({ where: { projectId: project.id } });
    expect(update.body).toBe("We finished the booking calendar.");
    expect(update.statusSnapshot).toBe("DEVELOPMENT");
    expect(update.progressSnapshot).toBe(40);
    expect(update.authorAdminId).toBe(admin.id);
    expect(update.authorTeamMemberId).toBeNull();
    expect(update.emailDeliveryState).toBe("SENT");
  });

  it("keeps the persisted update even when the email fails to send", async () => {
    mockSendEmail.mockResolvedValue("FAILED");
    const { admin, project } = await seedProjectWithAdmin();

    const result = await publishProjectUpdate(
      project.id,
      { kind: "admin", id: admin.id },
      "Still working on it.",
    );
    expect(result.emailSent).toBe(false);

    const update = await prisma.projectUpdate.findFirstOrThrow({ where: { projectId: project.id } });
    expect(update.body).toBe("Still working on it.");
    expect(update.emailDeliveryState).toBe("FAILED");
  });

  it("team member = admin: a team member can author an update too", async () => {
    mockSendEmail.mockResolvedValue("SENT");
    const { teamMember, project } = await seedProjectWithAdmin();

    const result = await publishProjectUpdate(
      project.id,
      { kind: "team", id: teamMember.id },
      "Deployed the staging build.",
    );
    expect(result.emailSent).toBe(true);

    const update = await prisma.projectUpdate.findFirstOrThrow({ where: { projectId: project.id } });
    expect(update.authorTeamMemberId).toBe(teamMember.id);
    expect(update.authorAdminId).toBeNull();
  });
});
