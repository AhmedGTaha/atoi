import { z } from "zod";
import { emailSchema } from "./auth";
import { optionalSafeUrlSchema } from "./url";

const recipientListSchema = z
  .string()
  .trim()
  .transform((v) =>
    v
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
  )
  .refine((list) => list.every((e) => z.string().email().safeParse(e).success), {
    message: "Enter one or more valid email addresses, separated by commas.",
  });

export const companySettingsSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required.").max(200),
  companyEmail: emailSchema,
  companyPhone: z.string().trim().min(1, "Company phone is required.").max(30),
  whatsappPhone: z.string().trim().max(30).optional().nullable(),
  locationEn: z.string().trim().min(1, "English location is required.").max(300),
  locationAr: z.string().trim().min(1, "Arabic location is required.").max(300),
  instagramUrl: optionalSafeUrlSchema,
  linkedinUrl: optionalSafeUrlSchema,
  requestNotificationRecipients: recipientListSchema,
  supportFallbackRecipients: recipientListSchema,
  seoTitleEn: z.string().trim().min(1).max(200),
  seoTitleAr: z.string().trim().min(1).max(200),
  seoDescriptionEn: z.string().trim().min(1).max(500),
  seoDescriptionAr: z.string().trim().min(1).max(500),
});

export type CompanySettingsInput = z.infer<typeof companySettingsSchema>;
