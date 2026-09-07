import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";
import { hashToken } from "@/lib/auth/tokens";

const mockSendEmail = vi.fn().mockResolvedValue("SENT");
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const {
  createTeamMember,
  setTeamMemberActive,
  sendTeamMemberInvitation,
  deleteTeamMember,
} = await import("@/lib/services/teamService");
const { consumeSetPasswordToken } = await import("@/lib/services/secureTokenService");

beforeEach(async () => {
  await resetDatabase();
  mockSendEmail.mockClear();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function createCustomerAndProject() {
  const customer = await prisma.customer.create({
    data: {
      email: `customer-${Date.now()}-${Math.random()}@example.com`,
      phoneCountry: "BH",
      phoneE164: "+97336001234",
      accountStatus: "ACTIVE",
    },
  });
  const project = await prisma.project.create({
    data: {
      customerId: customer.id,
      name: "Test project",
      description: "A project used in tests.",
      status: "DEVELOPMENT",
      progress: 10,
    },
  });
  return { customer, project };
}

describe("team member activate/deactivate", () => {
  it("toggles isActive without touching accountStatus", async () => {
    const member = await createTeamMember({ name: "Sam", email: "sam@example.com" });
    expect(member.isActive).toBe(true);

    const deactivated = await setTeamMemberActive(member.id, false);
    expect(deactivated.isActive).toBe(false);

    const reactivated = await setTeamMemberActive(member.id, true);
    expect(reactivated.isActive).toBe(true);
    expect(reactivated.accountStatus).toBe("INVITED");
  });
});

describe("team member resend invitation", () => {
  it("sends an invite email with a working token", async () => {
    const member = await createTeamMember({ name: "Lina", email: "lina@example.com" });

    const result = await sendTeamMemberInvitation(member.id);
    expect(result).toBe("SENT");
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail.mock.calls[0]![0].to).toBe("lina@example.com");

    const token = await prisma.secureToken.findFirstOrThrow({
      where: { teamMemberId: member.id, type: "TEAM_MEMBER_INVITE" },
    });
    expect(token.usedAt).toBeNull();

    const rawToken = mockSendEmail.mock.calls[0]![0].html.match(/token=([^"&]+)/)?.[1];
    expect(rawToken).toBeTruthy();
    expect(hashToken(decodeURIComponent(rawToken!))).toBe(token.tokenHash);

    const consumed = await consumeSetPasswordToken(decodeURIComponent(rawToken!), "newpassword123");
    expect(consumed.ok).toBe(true);

    const updated = await prisma.teamMember.findUniqueOrThrow({ where: { id: member.id } });
    expect(updated.accountStatus).toBe("ACTIVE");
    expect(updated.passwordHash).not.toBeNull();
  });

  it("invalidates the previous token when resent", async () => {
    const member = await createTeamMember({ name: "Omar", email: "omar@example.com" });

    await sendTeamMemberInvitation(member.id);
    const firstRaw = mockSendEmail.mock.calls[0]![0].html.match(/token=([^"&]+)/)?.[1];
    const firstToken = await prisma.secureToken.findFirstOrThrow({
      where: { teamMemberId: member.id, type: "TEAM_MEMBER_INVITE" },
    });

    await sendTeamMemberInvitation(member.id);
    const secondRaw = mockSendEmail.mock.calls[1]![0].html.match(/token=([^"&]+)/)?.[1];

    const firstAfterResend = await prisma.secureToken.findUniqueOrThrow({ where: { id: firstToken.id } });
    expect(firstAfterResend.usedAt).not.toBeNull();

    // The old link no longer works...
    const oldAttempt = await consumeSetPasswordToken(decodeURIComponent(firstRaw!), "somepassword1");
    expect(oldAttempt.ok).toBe(false);

    // ...but the new one does.
    const newAttempt = await consumeSetPasswordToken(decodeURIComponent(secondRaw!), "somepassword1");
    expect(newAttempt.ok).toBe(true);
  });

  it("refuses to resend once the member is already active", async () => {
    const member = await createTeamMember({ name: "Active Al", email: "active-al@example.com" });
    await prisma.teamMember.update({ where: { id: member.id }, data: { accountStatus: "ACTIVE" } });

    const result = await sendTeamMemberInvitation(member.id);
    expect(result).toBe("FAILED");
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});

describe("team member delete", () => {
  it("permanently removes an unassigned member and their tokens", async () => {
    const member = await createTeamMember({ name: "Unassigned", email: "unassigned@example.com" });
    await sendTeamMemberInvitation(member.id);

    await deleteTeamMember(member.id);

    const found = await prisma.teamMember.findUnique({ where: { id: member.id } });
    expect(found).toBeNull();

    const tokens = await prisma.secureToken.findMany({ where: { teamMemberId: member.id } });
    expect(tokens).toHaveLength(0);
  });

  it("permanently removes an assigned member and cascades ProjectMember without touching the project", async () => {
    const member = await createTeamMember({ name: "Assigned", email: "assigned@example.com" });
    const { project } = await createCustomerAndProject();
    await prisma.projectMember.create({ data: { projectId: project.id, teamMemberId: member.id } });

    await deleteTeamMember(member.id);

    const found = await prisma.teamMember.findUnique({ where: { id: member.id } });
    expect(found).toBeNull();

    const memberships = await prisma.projectMember.findMany({ where: { teamMemberId: member.id } });
    expect(memberships).toHaveLength(0);

    const stillThere = await prisma.project.findUnique({ where: { id: project.id } });
    expect(stillThere).not.toBeNull();
  });
});
