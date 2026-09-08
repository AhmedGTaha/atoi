import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "EMAIL_REQUIRED")
  .email("INVALID_EMAIL");

export const passwordSchema = z
  .string()
  .min(8, "PASSWORD_TOO_SHORT")
  .max(200, "PASSWORD_TOO_LONG")
  .refine((v) => /[a-zA-Z]/.test(v) && /[0-9]/.test(v), {
    message: "PASSWORD_REQUIRES_LETTER_AND_NUMBER",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "PASSWORD_REQUIRED"),
});

export const setPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "PASSWORD_CONFIRMATION_REQUIRED"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "PASSWORDS_DO_NOT_MATCH",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SetPasswordInput = z.infer<typeof setPasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
