import type { Metadata } from "next";
import { requireTeamMember } from "@/lib/auth/guards";
import { getCompanySettings } from "@/lib/services/settingsService";
import { TeamShell } from "@/components/team/TeamShell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [member, settings] = await Promise.all([requireTeamMember(), getCompanySettings()]);

  return (
    <TeamShell companyName={settings.companyName} memberName={member.name}>
      {children}
    </TeamShell>
  );
}
