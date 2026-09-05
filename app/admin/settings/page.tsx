import { requireAdmin } from "@/lib/auth/guards";
import { getCompanySettingsForAdmin } from "@/lib/services/settingsService";
import { PageHeader, Card } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { LogoUploadForm } from "@/components/admin/LogoUploadForm";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getCompanySettingsForAdmin();

  return (
    <div>
      <PageHeader title="Settings" description="Company details used across the public site and emails." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="font-bold">Logo</h2>
          <div className="mt-4">
            <LogoUploadForm currentLogoUrl={settings.logoPublicUrl} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-bold">Company details</h2>
          <div className="mt-4">
            <SettingsForm settings={settings} />
          </div>
        </Card>
      </div>
    </div>
  );
}
