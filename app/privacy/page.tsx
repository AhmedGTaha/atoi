import type { Metadata } from "next";
import Link from "next/link";
import { getCompanySettings } from "@/lib/services/settingsService";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCompanySettings();
  return { title: `Privacy Policy — ${settings.companyName}` };
}

export default async function PrivacyPage() {
  const settings = await getCompanySettings();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/" className="text-sm font-semibold text-blue-dark hover:underline">
        ← Back home
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-ink/70">
        <p>
          {settings.companyName} collects the information you provide when you submit a project
          request or use the customer portal — such as your name, business name, email address
          and phone number — solely to respond to your request and deliver our services.
        </p>
        <p>
          We do not sell your information. We use Resend to send transactional emails (request
          confirmations, account setup, project updates, and support notifications) and a
          PostgreSQL database to store your request and project information securely.
        </p>
        <p>
          Contact us at{" "}
          <a href={`mailto:${settings.companyEmail}`} className="underline">
            {settings.companyEmail}
          </a>{" "}
          with any questions about your data.
        </p>
      </div>
    </div>
  );
}
