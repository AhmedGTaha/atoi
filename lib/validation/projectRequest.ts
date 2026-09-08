import { z } from "zod";
import { BUSINESS_TYPES } from "./shared";
import { GCC_COUNTRY_CODES } from "./phone";

/**
 * Raw shape submitted by the public "Start a project" modal.
 * Phone normalization/validation happens separately via normalizeGccPhone
 * so we can return a field-specific error code.
 *
 * Every message here is a semantic error code (see lib/i18n/errors.ts), not
 * English prose — the presentation layer resolves it to locale-appropriate
 * text, keeping this schema locale-independent.
 */
export const projectRequestInputSchema = z
  .object({
    // Always submitted: the UI defaults the radio group to "business_website"
    // and browsers enforce exactly one selection in a radio group.
    businessType: z.enum(BUSINESS_TYPES, {
      message: "PROJECT_TYPE_REQUIRED",
    }),
    name: z
      .string()
      .trim()
      .max(200, "NAME_TOO_LONG")
      .optional()
      .nullable()
      .transform((v) => (v ? v : null)),
    businessName: z
      .string()
      .trim()
      .max(200, "COMPANY_NAME_TOO_LONG")
      .optional()
      .nullable()
      .transform((v) => (v ? v : null)),
    description: z
      .string()
      .trim()
      .min(20, "DESCRIPTION_TOO_SHORT")
      .max(5000, "DESCRIPTION_TOO_LONG"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "EMAIL_REQUIRED")
      .max(254, "EMAIL_TOO_LONG")
      .email("INVALID_EMAIL"),
    phoneCountry: z.enum(GCC_COUNTRY_CODES as [string, ...string[]], {
      message: "GCC_COUNTRY_REQUIRED",
    }),
    phoneNumber: z
      .string()
      .trim()
      .min(1, "PHONE_REQUIRED")
      .max(15, "PHONE_TOO_LONG"),
    preferredLocale: z.enum(["en", "ar"]).default("en"),
    // Honeypot field. Real visitors never see or fill this input; bots often
    // do. Checked (not validated away) by the caller before persisting.
    website: z.string().max(200).optional().default(""),
  })
  // Reject any field the client shouldn't be sending — nothing beyond this
  // exact shape is ever allowed to reach the database.
  .strict();

export type ProjectRequestInput = z.infer<typeof projectRequestInputSchema>;
