import { z } from "zod";

/**
 * Only allows http(s) URLs. Rejects javascript:, data:, and other schemes
 * that could be used for XSS if ever rendered as a link/attribute.
 */
export const safeUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => {
      if (value.length === 0) return true;
      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Enter a valid http(s) URL." }
  );

export const optionalSafeUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null))
  .refine(
    (value) => {
      if (!value) return true;
      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Enter a valid http(s) URL." }
  );
