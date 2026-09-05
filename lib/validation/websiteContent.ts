import { z } from "zod";

/**
 * Website content is plain text only (no HTML) so it can be rendered safely
 * without a sanitizer. Reject anything that looks like a markup tag.
 */
const plainTextSchema = z
  .string()
  .trim()
  .min(1, "This field is required.")
  .max(5000)
  .refine((v) => !/<[^>]*>/.test(v), {
    message: "HTML is not allowed here.",
  });

export const websiteContentEntrySchema = z.object({
  key: z.string().min(1),
  valueEn: plainTextSchema,
  valueAr: plainTextSchema,
});

export const websiteContentBatchSchema = z.object({
  entries: z.array(websiteContentEntrySchema).min(1),
});

export type WebsiteContentEntryInput = z.infer<typeof websiteContentEntrySchema>;
