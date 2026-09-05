import { z } from "zod";
import { emailSchema } from "./auth";

export const teamMemberSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  email: emailSchema,
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
