import { afterEach, describe, expect, it, vi } from "vitest";
import { appUrl } from "@/lib/utils/appUrl";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("appUrl", () => {
  it.each([
    "http://atoi.online",
    "http://www.atoi.online",
    "https://www.atoi.online",
  ])("normalizes %s to the canonical production origin", (origin) => {
    vi.stubEnv("APP_URL", origin);

    expect(appUrl("/services/pos-system-development?source=audit")).toBe(
      "https://atoi.online/services/pos-system-development?source=audit",
    );
  });

  it("keeps the canonical production origin and local development origin", () => {
    vi.stubEnv("APP_URL", "https://atoi.online");
    expect(appUrl("/ar")).toBe("https://atoi.online/ar");

    vi.stubEnv("APP_URL", "http://localhost:3000");
    expect(appUrl("/ar")).toBe("http://localhost:3000/ar");
  });
});
