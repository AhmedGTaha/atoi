import { z } from "zod";
import { optionalSafeUrlSchema } from "./url";

export const portfolioProjectSchema = z.object({
  titleEn: z.string().trim().min(1, "English title is required.").max(200),
  titleAr: z.string().trim().min(1, "Arabic title is required.").max(200),
  descriptionEn: z
    .string()
    .trim()
    .min(1, "English description is required.")
    .max(2000),
  descriptionAr: z
    .string()
    .trim()
    .min(1, "Arabic description is required.")
    .max(2000),
  category: z.string().trim().max(100).optional().nullable(),
  clientName: z.string().trim().max(200).optional().nullable(),
  problemEn: z.string().trim().max(4000).optional().nullable(),
  problemAr: z.string().trim().max(4000).optional().nullable(),
  builtEn: z.string().trim().max(4000).optional().nullable(),
  builtAr: z.string().trim().max(4000).optional().nullable(),
  resultEn: z.string().trim().max(4000).optional().nullable(),
  resultAr: z.string().trim().max(4000).optional().nullable(),
  technologies: z.array(z.string().trim().min(1).max(80)).max(12).default([]),
  liveUrl: optionalSafeUrlSchema,
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export type PortfolioProjectInput = z.infer<typeof portfolioProjectSchema>;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
