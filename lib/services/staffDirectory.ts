import "server-only";
import { prisma } from "@/lib/db/client";
import { emailSchema } from "@/lib/validation/auth";

export interface StaffContact {
  id: string;
  name: string;
  email: string;
  kind: "admin" | "team";
}

/**
 * Team member = Admin: every active AdminUser and every active TeamMember
 * has full admin access, so both are "staff" for authorization and
 * notification purposes. This is the single place that resolves who counts
 * as staff — callers should use this (or listStaffNotificationEmails)
 * instead of querying AdminUser/TeamMember directly or reading a
 * hand-configured recipient list.
 */
export async function listStaffContacts(): Promise<StaffContact[]> {
  const [admins, teamMembers] = await Promise.all([
    prisma.adminUser.findMany({ where: { isActive: true } }),
    prisma.teamMember.findMany({
      where: { isActive: true, accountStatus: "ACTIVE" },
    }),
  ]);

  return [
    ...admins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      kind: "admin" as const,
    })),
    ...teamMembers.map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      kind: "team" as const,
    })),
  ];
}

/**
 * De-duplicated recipient emails for staff-wide notifications (new
 * requests, support messages, and other events every team member/admin
 * should see). AdminUser and TeamMember emails are already unique across
 * both tables (see accountIdentityService), so this never emails the same
 * person twice.
 */
export async function listStaffNotificationEmails(): Promise<string[]> {
  const contacts = await listStaffContacts();
  const emails = new Set<string>();

  for (const contact of contacts) {
    const parsed = emailSchema.safeParse(contact.email);
    if (!parsed.success) {
      console.error("[staff-directory] Invalid active staff email skipped.", {
        staffId: contact.id,
        kind: contact.kind,
      });
      continue;
    }
    emails.add(parsed.data);
  }

  return Array.from(emails);
}
