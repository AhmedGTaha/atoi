import "server-only";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/client";
import { findOrCreateCustomer, sendCustomerInvitation } from "./customerService";
import { getCompanySettings } from "./settingsService";
import { sendEmail } from "@/lib/email/resend";
import { projectUpdateEmail } from "@/lib/email/templates";
import { appUrl } from "@/lib/utils/appUrl";
import type { GccCountryCode } from "@/lib/validation/phone";
import type { ProjectStatusValue } from "@/lib/validation/shared";

export interface ConvertRequestInput {
  requestId: string;
  projectName: string;
  description: string;
  customerName: string | null;
  businessName: string | null;
  email: string;
  phoneCountry: GccCountryCode;
  phoneNumber: string;
  memberIds: string[];
}

export interface ConvertRequestResult {
  projectId: string;
  customerId: string;
  customerCreated: boolean;
  invitationEmailSent: boolean;
}

export async function convertRequestToProject(
  input: ConvertRequestInput
): Promise<ConvertRequestResult> {
  const request = await prisma.projectRequest.findUniqueOrThrow({ where: { id: input.requestId } });

  const { customer, createdNew } = await findOrCreateCustomer({
    name: input.customerName,
    businessName: input.businessName,
    email: input.email,
    phoneCountry: input.phoneCountry,
    phoneNumber: input.phoneNumber,
    preferredLocale: request.preferredLocale,
  });

  const project = await prisma.project.create({
    data: {
      customerId: customer.id,
      name: input.projectName,
      description: input.description,
      status: "PENDING_TEAM_APPROVAL",
      progress: 0,
      members: {
        create: input.memberIds.map((teamMemberId) => ({ teamMemberId })),
      },
    },
  });

  await prisma.projectRequest.update({
    where: { id: request.id },
    data: {
      state: "CONVERTED",
      convertedCustomerId: customer.id,
      convertedProjectId: project.id,
    },
  });

  let invitationEmailSent = false;
  if (customer.accountStatus === "INVITED") {
    const state = await sendCustomerInvitation(customer.id);
    invitationEmailSent = state === "SENT";
  }

  return {
    projectId: project.id,
    customerId: customer.id,
    customerCreated: createdNew,
    invitationEmailSent,
  };
}

export async function listProjectsForAdmin(params?: { search?: string; status?: ProjectStatusValue }) {
  return prisma.project.findMany({
    where: {
      status: params?.status,
      OR: params?.search
        ? [
            { name: { contains: params.search, mode: "insensitive" } },
            { customer: { name: { contains: params.search, mode: "insensitive" } } },
            { customer: { businessName: { contains: params.search, mode: "insensitive" } } },
            { customer: { email: { contains: params.search, mode: "insensitive" } } },
          ]
        : undefined,
    },
    include: {
      customer: true,
      members: { include: { teamMember: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectForAdmin(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      customer: true,
      members: { include: { teamMember: true } },
      updates: {
        orderBy: { createdAt: "desc" },
        include: { author: true, authorTeamMember: true },
      },
      supportRequests: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function updateProjectDetails(
  id: string,
  input: {
    name: string;
    description: string;
    status: ProjectStatusValue;
    progress: number;
    memberIds: string[];
  }
) {
  await prisma.$transaction([
    prisma.project.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        status: input.status,
        progress: input.progress,
      },
    }),
    prisma.projectMember.deleteMany({ where: { projectId: id } }),
    prisma.projectMember.createMany({
      data: input.memberIds.map((teamMemberId) => ({ projectId: id, teamMemberId })),
      skipDuplicates: true,
    }),
  ]);
}

export interface PublishUpdateResult {
  emailSent: boolean;
}

export async function publishProjectUpdate(
  projectId: string,
  author: { kind: "admin" | "team"; id: string },
  body: string
): Promise<PublishUpdateResult> {
  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
    include: { customer: true },
  });

  const update = await prisma.projectUpdate.create({
    data: {
      projectId,
      authorAdminId: author.kind === "admin" ? author.id : null,
      authorTeamMemberId: author.kind === "team" ? author.id : null,
      body,
      statusSnapshot: project.status,
      progressSnapshot: project.progress,
    },
  });

  const settings = await getCompanySettings();
  const email = projectUpdateEmail(
    project.customer.preferredLocale,
    settings.companyName,
    project.name,
    body,
    project.status,
    project.progress,
    appUrl(`/portal/projects/${project.id}`)
  );

  const state = await sendEmail({ to: project.customer.email, subject: email.subject, html: email.html });

  await prisma.projectUpdate.update({
    where: { id: update.id },
    data: { emailDeliveryState: state },
  });
  revalidateTag(`portal-project-${projectId}`);

  return { emailSent: state === "SENT" };
}

export async function listCustomerProjects(customerId: string) {
  return prisma.project.findMany({
    where: { customerId },
    orderBy: { updatedAt: "desc" },
  });
}

/** Authorization-critical: only returns the project if it belongs to this customer. */
export async function getOwnedCustomerProject(customerId: string, projectId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, customerId },
    include: {
      updates: { orderBy: { createdAt: "desc" } },
    },
  });
}
