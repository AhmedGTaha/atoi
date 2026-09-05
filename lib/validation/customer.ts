import { z } from "zod";
import { emailSchema } from "./auth";
import { GCC_COUNTRY_CODES } from "./phone";

export const createCustomerSchema = z.object({
  name: z.string().trim().max(200).optional().nullable(),
  businessName: z.string().trim().max(200).optional().nullable(),
  email: emailSchema,
  phoneCountry: z.enum(GCC_COUNTRY_CODES as [string, ...string[]]),
  phoneNumber: z.string().trim().min(1, "Phone number is required."),
  preferredLocale: z.enum(["en", "ar"]).default("en"),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
