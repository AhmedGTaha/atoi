import { z } from "zod";

export const supportRequestInputSchema = z.object({
  message: z
    .string()
    .trim()
    .min(5, "Please enter at least 5 characters.")
    .max(5000, "Message must be 5000 characters or fewer."),
});

export type SupportRequestInput = z.infer<typeof supportRequestInputSchema>;
