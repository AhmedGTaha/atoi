import { describe, it, expect } from "vitest";
import { projectRequestInputSchema } from "@/lib/validation/projectRequest";

const validBase = {
  description: "I need a new website for my cafe with online ordering.",
  email: "owner@example.com",
  phoneCountry: "BH",
  phoneNumber: "36001234",
};

describe("projectRequestInputSchema", () => {
  it("accepts a minimal valid submission with only required fields", () => {
    const result = projectRequestInputSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("treats businessType and name as optional", () => {
    const result = projectRequestInputSchema.safeParse(validBase);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.businessType ?? null).toBeNull();
      expect(result.data.name).toBeNull();
    }
  });

  it("rejects a description shorter than 10 characters", () => {
    const result = projectRequestInputSchema.safeParse({ ...validBase, description: "too short" });
    expect(result.success).toBe(false);
  });

  it("rejects a description longer than 5000 characters", () => {
    const result = projectRequestInputSchema.safeParse({
      ...validBase,
      description: "a".repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed email", () => {
    const result = projectRequestInputSchema.safeParse({ ...validBase, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("normalizes email casing and whitespace", () => {
    const result = projectRequestInputSchema.safeParse({
      ...validBase,
      email: "  Owner@Example.com  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("owner@example.com");
    }
  });

  it("rejects a non-GCC phone country", () => {
    const result = projectRequestInputSchema.safeParse({ ...validBase, phoneCountry: "US" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing phone number", () => {
    const result = projectRequestInputSchema.safeParse({ ...validBase, phoneNumber: "" });
    expect(result.success).toBe(false);
  });
});
