import { describe, it, expect } from "vitest";
import { getErrorMessage, isErrorCode } from "@/lib/i18n/errors";
import { dictionaries } from "@/lib/i18n/dictionaries";

describe("isErrorCode", () => {
  it("recognizes known codes and rejects arbitrary strings", () => {
    expect(isErrorCode("INVALID_CREDENTIALS")).toBe(true);
    expect(isErrorCode("PHONE_INVALID_FOR_COUNTRY")).toBe(true);
    expect(isErrorCode("Not a real code")).toBe(false);
  });
});

describe("getErrorMessage", () => {
  it("resolves a code to English or Arabic text", () => {
    expect(getErrorMessage("en", "INVALID_CREDENTIALS")).toBe(
      "Incorrect email or password.",
    );
    expect(getErrorMessage("ar", "INVALID_CREDENTIALS")).toBe(
      "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    );
  });

  it("interpolates params such as the localized country name", () => {
    const message = getErrorMessage("ar", "PHONE_INVALID_FOR_COUNTRY", {
      country: "البحرين",
    });
    expect(message).toContain("البحرين");
  });

  it("never leaks English error text into an Arabic-resolved message", () => {
    for (const code of Object.keys(dictionaries.ar.errors)) {
      const message = getErrorMessage("ar", code as never)
        // Strip un-interpolated {placeholder} tokens (e.g. phone codes
        // rendered without params in this loop) before checking for leaks.
        .replace(/\{[a-zA-Z]+\}/g, "")
        .replace(/SaaS|ATOI/g, "");
      expect(/[a-zA-Z]{4,}/.test(message)).toBe(false);
    }
  });
});
