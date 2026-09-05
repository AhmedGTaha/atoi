import { z } from "zod";
import { progressSchema, projectStatusSchema } from "./shared";

export const createProjectSchema = z.object({
  customerId: z.string().uuid().optional(),
  name: z.string().trim().min(2, "Project name is required.").max(200),
  description: z.string().trim().min(1, "Description is required.").max(10000),
  memberIds: z.array(z.string().uuid()).default([]),
  requestId: z.string().uuid().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(2, "Project name is required.").max(200),
  description: z.string().trim().min(1, "Description is required.").max(10000),
  status: projectStatusSchema,
  progress: progressSchema,
  memberIds: z.array(z.string().uuid()).default([]),
});

export const projectUpdateInputSchema = z.object({
  body: z
    .string()
    .trim()
    .min(3, "Update text is required.")
    .max(10000, "Update text must be 10000 characters or fewer."),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateInputSchema>;
