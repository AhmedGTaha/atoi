import "server-only";
import { prisma } from "@/lib/db/client";

export async function listProjectRequests() {
  return prisma.projectRequest.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getProjectRequest(id: string) {
  return prisma.projectRequest.findUnique({
    where: { id },
    include: { convertedCustomer: true, convertedProject: true },
  });
}

export async function archiveProjectRequest(id: string) {
  await prisma.projectRequest.update({ where: { id }, data: { state: "ARCHIVED" } });
}

export async function dashboardCounts() {
  const [newRequests, activeProjects, supportRequests, completedProjects] = await Promise.all([
    prisma.projectRequest.count({ where: { state: "NEW" } }),
    prisma.project.count({ where: { status: { not: "DONE" } } }),
    prisma.supportRequest.count(),
    prisma.project.count({ where: { status: "DONE" } }),
  ]);

  const [recentRequests, activeProjectsList, recentSupport] = await Promise.all([
    prisma.projectRequest.findMany({
      where: { state: "NEW" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.project.findMany({
      where: { status: { not: "DONE" } },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { customer: true },
    }),
    prisma.supportRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { customer: true, project: true },
    }),
  ]);

  return {
    counts: { newRequests, activeProjects, supportRequests, completedProjects },
    recentRequests,
    activeProjectsList,
    recentSupport,
  };
}
