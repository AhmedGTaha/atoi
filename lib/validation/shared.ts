import { z } from "zod";

export const BUSINESS_TYPES = [
  "restaurant_cafe",
  "retail",
  "salon_beauty",
  "healthcare",
  "professional_services",
  "construction",
  "ecommerce",
  "startup",
  "other",
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const PROJECT_STATUSES = [
  "PENDING_TEAM_APPROVAL",
  "DEVELOPMENT",
  "TESTING",
  "DONE",
] as const;

export type ProjectStatusValue = (typeof PROJECT_STATUSES)[number];

export const projectStatusSchema = z.enum(PROJECT_STATUSES);

export const progressSchema = z
  .number({ message: "Progress must be a number." })
  .int("Progress must be a whole number.")
  .min(0, "Progress cannot be below 0.")
  .max(100, "Progress cannot be above 100.");

export const localeSchema = z.enum(["en", "ar"]);

export function isValidProjectStatus(value: string): value is ProjectStatusValue {
  return (PROJECT_STATUSES as readonly string[]).includes(value);
}

export function isValidProgress(value: unknown): value is number {
  return progressSchema.safeParse(value).success;
}
