import { z } from "zod";

export const supportRequestInputSchema = z.object({
  message: z
    .string()
    .trim()
    .min(5, "MESSAGE_TOO_SHORT")
    .max(5000, "MESSAGE_TOO_LONG"),
});

export type SupportRequestInput = z.infer<typeof supportRequestInputSchema>;
