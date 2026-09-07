import { describe, it, expect } from "vitest";
import {
  requestConfirmationEmail,
  customerInvitationEmail,
  teamMemberInvitationEmail,
  passwordResetEmail,
  projectUpdateEmail,
  internalNewRequestEmail,
  supportNotificationEmail,
} from "@/lib/email/templates";

const COMPANY = "ATOI";

/** Mirrors lib/email/layout.ts's escapeHtml, so URLs containing "&" etc. match the rendered HTML. */
function htmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Shared assertions every actionable email must satisfy. */
function expectActionableEmail(html: string, ctaLabel: string, ctaUrl: string) {
  const escapedUrl = htmlEscape(ctaUrl);
  const escapedLabel = htmlEscape(ctaLabel);
  // CTA button: an anchor with the right href and visible label text.
  const hrefRe = new RegExp(`<a href="${escapeRe(escapedUrl)}"[^>]*>\\s*${escapeRe(escapedLabel)}\\s*<\\/a>`);
  expect(html).toMatch(hrefRe);
  // Fallback plain-text link below the button, same URL, for clients that
  // strip button styling or block the link.
  const fallbackCount = (html.match(new RegExp(escapeRe(escapedUrl), "g")) ?? []).length;
  expect(fallbackCount).toBeGreaterThanOrEqual(2);
}

function escapeRe(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("email templates — no stale branding", () => {
  it("never contains the retired 'Atrio' name in any template's output", () => {
    const samples = [
      requestConfirmationEmail("en", COMPANY, "Need a website.").html,
      requestConfirmationEmail("ar", COMPANY, "أحتاج موقعاً.").html,
      customerInvitationEmail("en", COMPANY, "https://atoi.online/set-password?token=abc").html,
      customerInvitationEmail("ar", COMPANY, "https://atoi.online/set-password?token=abc").html,
      teamMemberInvitationEmail(COMPANY, "https://atoi.online/set-password?token=abc&mode=team").html,
      passwordResetEmail("en", COMPANY, "https://atoi.online/set-password?token=abc&mode=reset").html,
      passwordResetEmail("ar", COMPANY, "https://atoi.online/set-password?token=abc&mode=reset").html,
      projectUpdateEmail("en", COMPANY, "Salon Booking", "Update body.", "DEVELOPMENT", 40, "https://atoi.online/portal/projects/1").html,
      internalNewRequestEmail(COMPANY, {
        name: "A",
        businessName: null,
        businessType: null,
        email: "a@example.com",
        phone: "+97336000000",
        description: "desc",
        submittedAt: new Date().toISOString(),
        adminUrl: "https://atoi.online/admin/requests/1",
      }).html,
      supportNotificationEmail(COMPANY, {
        projectName: "Salon Booking",
        customerLabel: "Jane",
        message: "Help",
        adminUrl: "https://atoi.online/admin/projects/1",
      }).html,
    ];

    for (const html of samples) {
      expect(html).not.toMatch(/atrio/i);
      expect(html).not.toMatch(/أتريو/);
      expect(html).toContain("ATOI");
    }
  });
});

describe("requestConfirmationEmail", () => {
  it("has a subject and a CTA with fallback link, and escapes the description", () => {
    const email = requestConfirmationEmail("en", COMPANY, "<script>alert(1)</script>");
    expect(email.subject).toBe("We've received your request");
    expect(email.html).not.toContain("<script>alert(1)</script>");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).toMatch(/Visit ATOI/);
  });

  it("renders right-to-left for Arabic while keeping the same branded shell", () => {
    const email = requestConfirmationEmail("ar", COMPANY, "وصف المشروع");
    expect(email.html).toContain('dir="rtl"');
    expect(email.html).toContain('lang="ar"');
    expect(email.html).toContain("ATOI");
  });
});

describe("customerInvitationEmail", () => {
  const url = "https://atoi.online/set-password?token=abc123";

  it("has a working CTA button and fallback link pointing at the setup URL", () => {
    const email = customerInvitationEmail("en", COMPANY, url);
    expect(email.subject).toContain("ATOI");
    expectActionableEmail(email.html, "Set password", url);
  });

  it("uses the company name, not a hardcoded brand, in the invitation body", () => {
    const email = customerInvitationEmail("en", "Some Other Studio", url);
    expect(email.html).toContain("Some Other Studio");
    expect(email.html).not.toMatch(/atrio/i);
  });

  it("is right-to-left for Arabic", () => {
    const email = customerInvitationEmail("ar", COMPANY, url);
    expect(email.html).toContain('dir="rtl"');
  });
});

describe("teamMemberInvitationEmail", () => {
  const url = "https://atoi.online/set-password?token=xyz789&mode=team";

  it("has the exact 'Set password & sign in' CTA per the invite flow", () => {
    const email = teamMemberInvitationEmail(COMPANY, url);
    expect(email.subject).toContain("ATOI");
    expectActionableEmail(email.html, "Set password & sign in", url);
  });

  it("is always English regardless of any surrounding locale, and escapes href-breaking tokens", () => {
    const trickyUrl = "https://atoi.online/set-password?token=a%22b&mode=team";
    const email = teamMemberInvitationEmail(COMPANY, trickyUrl);
    expect(email.html).toContain('lang="en"');
    expect(email.html).not.toContain('href="https://atoi.online/set-password?token=a"b&mode=team"');
  });
});

describe("passwordResetEmail", () => {
  const url = "https://atoi.online/set-password?token=reset1&mode=reset";

  it("has the 'Reset password' CTA and fallback link", () => {
    const email = passwordResetEmail("en", COMPANY, url);
    expectActionableEmail(email.html, "Reset password", url);
  });
});

describe("projectUpdateEmail", () => {
  it("has a 'View project' CTA linking to the portal, and escapes the update body", () => {
    const portalUrl = "https://atoi.online/portal/projects/proj-1";
    const email = projectUpdateEmail(
      "en",
      COMPANY,
      "Salon Booking",
      "<b>Danger</b> & progress",
      "DEVELOPMENT",
      55,
      portalUrl
    );
    expect(email.subject).toBe("Project update: Salon Booking");
    expectActionableEmail(email.html, "View project", portalUrl);
    expect(email.html).toContain("&lt;b&gt;Danger&lt;/b&gt; &amp; progress");
    expect(email.html).not.toContain("<b>Danger</b>");
  });
});

describe("internalNewRequestEmail", () => {
  it("has an 'Open request' CTA linking to the admin URL and escapes every field", () => {
    const adminUrl = "https://atoi.online/admin/requests/req-1";
    const email = internalNewRequestEmail(COMPANY, {
      name: "<img src=x onerror=alert(1)>",
      businessName: "Bloom & Co",
      businessType: "Retail",
      email: "attacker@example.com",
      phone: "+97336000000",
      description: "normal description",
      submittedAt: new Date().toISOString(),
      adminUrl,
    });
    expectActionableEmail(email.html, "Open request", adminUrl);
    expect(email.html).not.toContain("<img src=x onerror=alert(1)>");
    expect(email.html).toContain("Bloom &amp; Co");
  });
});

describe("supportNotificationEmail", () => {
  it("has an 'Open project' CTA linking to the admin URL", () => {
    const adminUrl = "https://atoi.online/admin/projects/proj-2";
    const email = supportNotificationEmail(COMPANY, {
      projectName: "Salon Booking",
      customerLabel: "Jane <script>",
      message: "Need help",
      adminUrl,
    });
    expectActionableEmail(email.html, "Open project", adminUrl);
    expect(email.html).not.toContain("<script>");
  });
});
