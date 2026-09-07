import { z } from "zod";
import { BUSINESS_TYPES } from "./shared";
import { GCC_COUNTRY_CODES } from "./phone";

/**
 * Raw shape submitted by the public "Start a project" modal.
 * Phone normalization/validation happens separately via normalizeGccPhone
 * so we can return a field-specific error message.
 */
export const projectRequestInputSchema = z
  .object({
    // Always submitted: the UI defaults the radio group to "business_website"
    // and browsers enforce exactly one selection in a radio group.
    businessType: z.enum(BUSINESS_TYPES, {
      message: "Select a project type.",
    }),
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
      .max(200, "Company name is too long.")
      .optional()
      .nullable()
      .transform((v) => (v ? v : null)),
    description: z
      .string()
      .trim()
      .min(20, "A little more detail, please (20+ characters).")
      .max(5000, "Description must be 5000 characters or fewer."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required.")
      .max(254, "Email is too long.")
      .email("Enter a valid email address."),
    phoneCountry: z.enum(GCC_COUNTRY_CODES as [string, ...string[]], {
      message: "Select a GCC country.",
    }),
    phoneNumber: z
      .string()
      .trim()
      .min(1, "Phone number is required.")
      .max(15, "Phone number is too long."),
    preferredLocale: z.enum(["en", "ar"]).default("en"),
    // Honeypot field. Real visitors never see or fill this input; bots often
    // do. Checked (not validated away) by the caller before persisting.
    website: z.string().max(200).optional().default(""),
  })
  // Reject any field the client shouldn't be sending — nothing beyond this
  // exact shape is ever allowed to reach the database.
  .strict();

export type ProjectRequestInput = z.infer<typeof projectRequestInputSchema>;
