import { ThemeToggle } from "@/components/ThemeToggle";
import type { Metadata } from "next";
import Link from "next/link";
import { getCompanySettings } from "@/lib/services/settingsService";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCompanySettings();
  return { title: `Terms of Service — ${settings.companyName}` };
}

export default async function TermsPage() {
  const settings = await getCompanySettings();

  return (
    <main id="main-content" className="legal-page">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-accent hover:underline"
        >
          ← Back home
        </Link>
        <ThemeToggle />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-normal">
        Terms of Service
      </h1>
      <div className="mt-6 space-y-4 text-foreground/70">
        <p>
          By submitting a project request or using the {settings.companyName}{" "}
          customer portal, you agree to provide accurate contact information so
          we can respond to you.
        </p>
        <p>
          Project scope, timelines and deliverables are agreed directly between
          you and {settings.companyName} outside of this website. This site is
          used to submit requests, track project status and progress, and reach
          our team for support.
        </p>
        <p>
          Contact us at{" "}
          <a href={`mailto:${settings.companyEmail}`} className="underline">
            {settings.companyEmail}
          </a>{" "}
          with any questions.
        </p>
      </div>
    </main>
  );
}
