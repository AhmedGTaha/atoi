import { z } from "zod";
import { BUSINESS_TYPES } from "./shared";
import { GCC_COUNTRY_CODES } from "./phone";

/**
 * Raw shape submitted by the public "Start a project" modal.
 * Phone normalization/validation happens separately via normalizeGccPhone
 * so we can return a field-specific error message.
 */
export const projectRequestInputSchema = z.object({
  businessType: z.enum(BUSINESS_TYPES).optional().nullable(),
  name: z
    .string()
    .trim()
    .max(200, "Name is too long.")
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  businessName: z
    .string()
    .trim()
    .max(200, "Business name is too long.")
    .optional()
    .nullable()
    .transform((v) => (v ? v : null)),
  description: z
    .string()
    .trim()
    .min(10, "Please describe your project in at least 10 characters.")
    .max(5000, "Description must be 5000 characters or fewer."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  phoneCountry: z.enum(GCC_COUNTRY_CODES as [string, ...string[]], {
    message: "Select a GCC country.",
  }),
  phoneNumber: z.string().trim().min(1, "Phone number is required."),
  preferredLocale: z.enum(["en", "ar"]).default("en"),
  // Honeypot field. Real visitors never see or fill this input; bots often
  // do. Checked (not validated away) by the caller before persisting.
  website: z.string().optional().default(""),
});

export type ProjectRequestInput = z.infer<typeof projectRequestInputSchema>;
