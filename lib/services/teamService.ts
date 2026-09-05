import "server-only";
import { prisma } from "@/lib/db/client";
import type { TeamMemberInput } from "@/lib/validation/team";

export async function listTeamMembers() {
  return prisma.teamMember.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { projects: true } } },
  });
}

export async function getTeamMember(id: string) {
  return prisma.teamMember.findUnique({ where: { id } });
}

export async function createTeamMember(input: TeamMemberInput) {
  return prisma.teamMember.create({ data: input });
}

export async function updateTeamMember(id: string, input: TeamMemberInput) {
  return prisma.teamMember.update({ where: { id }, data: input });
}

export async function setTeamMemberActive(id: string, isActive: boolean) {
  return prisma.teamMember.update({ where: { id }, data: { isActive } });
}

export async function listActiveTeamMembers() {
  return prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
}
