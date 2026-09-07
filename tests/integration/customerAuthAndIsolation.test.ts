import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";
import { hashToken } from "@/lib/auth/tokens";

const mockSendEmail = vi.fn().mockResolvedValue("SENT");
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const { sendCustomerInvitation, authenticateCustomer } = await import("@/lib/services/customerService");
const { consumeSetPasswordToken } = await import("@/lib/services/secureTokenService");
const { getOwnedCustomerProject } = await import("@/lib/services/projectService");

beforeEach(async () => {
  await resetDatabase();
  mockSendEmail.mockClear();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("customer invitation + set password", () => {
  it("lets an invited customer set a password and then log in", async () => {
    const customer = await prisma.customer.create({
      data: {
        email: "invitee@example.com",
        phoneCountry: "BH",
        phoneE164: "+97336001234",
        accountStatus: "INVITED",
      },
    });

    await sendCustomerInvitation(customer.id);
    const token = await prisma.secureToken.findFirstOrThrow({ where: { customerId: customer.id } });
    expect(token.type).toBe("CUSTOMER_INVITE");
    expect(token.tokenHash).not.toBe(""); // never stored in plaintext form

    // Recover the raw token the way the customer would from their email link:
    // we can't invert the hash, so re-derive it is not possible — instead
    // verify the invariant directly: a random raw token which hashes to the
    // stored value is what set-password must require.
    const rawTokenFromEmail = mockSendEmail.mock.calls[0]![0].html.match(/token=([^"&]+)/)?.[1];
    expect(rawTokenFromEmail).toBeTruthy();
    expect(hashToken(decodeURIComponent(rawTokenFromEmail!))).toBe(token.tokenHash);

    const result = await consumeSetPasswordToken(decodeURIComponent(rawTokenFromEmail!), "newpassword123");
    expect(result.ok).toBe(true);

    const updated = await prisma.customer.findUniqueOrThrow({ where: { id: customer.id } });
    expect(updated.accountStatus).toBe("ACTIVE");
    expect(updated.passwordHash).not.toBeNull();

    const authenticated = await authenticateCustomer("invitee@example.com", "newpassword123");
    expect(authenticated?.id).toBe(customer.id);

    // The token is single-use.
    const reuse = await consumeSetPasswordToken(decodeURIComponent(rawTokenFromEmail!), "anotherpassword1");
    expect(reuse.ok).toBe(false);
  });
});

describe("customer project isolation", () => {
  it("never returns a project that belongs to a different customer", async () => {
    const customerA = await prisma.customer.create({
      data: {
        email: "a@example.com",
        phoneCountry: "BH",
        phoneE164: "+97336001111",
        accountStatus: "ACTIVE",
        passwordHash: "hash",
      },
    });
    const customerB = await prisma.customer.create({
      data: {
        email: "b@example.com",
        phoneCountry: "BH",
        phoneE164: "+97336002222",
        accountStatus: "ACTIVE",
        passwordHash: "hash",
      },
    });
    const projectB = await prisma.project.create({
      data: {
        customerId: customerB.id,
        name: "Customer B's project",
        description: "Confidential to B.",
        status: "DEVELOPMENT",
        progress: 10,
      },
    });

    // Customer A tries to open customer B's project by guessing/changing the ID.
    const result = await getOwnedCustomerProject(customerA.id, projectB.id);
    expect(result).toBeNull();

    // But customer B can access their own project fine.
    const ownResult = await getOwnedCustomerProject(customerB.id, projectB.id);
    expect(ownResult?.id).toBe(projectB.id);
  });
});
