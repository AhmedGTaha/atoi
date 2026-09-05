import { describe, it, expect } from "vitest";
import { isValidProgress, isValidProjectStatus, PROJECT_STATUSES } from "@/lib/validation/shared";

describe("isValidProgress", () => {
  it("accepts integers between 0 and 100 inclusive", () => {
    expect(isValidProgress(0)).toBe(true);
    expect(isValidProgress(100)).toBe(true);
    expect(isValidProgress(57)).toBe(true);
  });

  it("rejects negative numbers", () => {
    expect(isValidProgress(-1)).toBe(false);
  });

  it("rejects numbers above 100", () => {
    expect(isValidProgress(101)).toBe(false);
  });

  it("rejects non-integers", () => {
    expect(isValidProgress(50.5)).toBe(false);
  });

  it("rejects non-numeric values", () => {
    expect(isValidProgress("50")).toBe(false);
    expect(isValidProgress(null)).toBe(false);
    expect(isValidProgress(undefined)).toBe(false);
  });
});

describe("isValidProjectStatus", () => {
  it("accepts exactly the four defined statuses", () => {
    expect(PROJECT_STATUSES).toEqual([
      "PENDING_TEAM_APPROVAL",
      "DEVELOPMENT",
      "TESTING",
      "DONE",
    ]);
    for (const status of PROJECT_STATUSES) {
      expect(isValidProjectStatus(status)).toBe(true);
    }
  });

  it("rejects statuses outside the fixed set", () => {
    expect(isValidProjectStatus("ON_HOLD")).toBe(false);
    expect(isValidProjectStatus("DESIGN")).toBe(false);
    expect(isValidProjectStatus("")).toBe(false);
  });
});
