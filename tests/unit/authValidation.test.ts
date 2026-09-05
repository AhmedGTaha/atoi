import { describe, it, expect } from "vitest";
import { emailSchema, passwordSchema, loginSchema, setPasswordSchema } from "@/lib/validation/auth";

describe("emailSchema", () => {
  it("accepts a valid email", () => {
    expect(emailSchema.safeParse("person@example.com").success).toBe(true);
  });

  it("rejects an email without an @", () => {
    expect(emailSchema.safeParse("personexample.com").success).toBe(false);
  });

  it("trims and lowercases", () => {
    const result = emailSchema.safeParse("  Person@Example.COM ");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("person@example.com");
  });
});

describe("passwordSchema", () => {
  it("rejects passwords shorter than 8 characters", () => {
    expect(passwordSchema.safeParse("ab1").success).toBe(false);
  });

  it("rejects a password with no digits", () => {
    expect(passwordSchema.safeParse("longenoughpassword").success).toBe(false);
  });

  it("accepts a password with letters and numbers", () => {
    expect(passwordSchema.safeParse("password123").success).toBe(true);
  });
});

describe("loginSchema", () => {
  it("requires both email and password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });
});

describe("setPasswordSchema", () => {
  it("rejects mismatched passwords", () => {
    const result = setPasswordSchema.safeParse({
      token: "abc",
      password: "password123",
      confirmPassword: "password124",
    });
    expect(result.success).toBe(false);
  });

  it("accepts matching passwords", () => {
    const result = setPasswordSchema.safeParse({
      token: "abc",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });
});
