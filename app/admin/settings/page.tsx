import { requireAdmin } from "@/lib/auth/guards";
import { getCompanySettingsForAdmin } from "@/lib/services/settingsService";
import { getLogoAssets } from "@/lib/services/logoService";
import { PageHeader, Card } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { LogoManager } from "@/components/admin/LogoManager";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const [settings, logoAssets] = await Promise.all([
    getCompanySettingsForAdmin(),
    getLogoAssets(),
  ]);

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Company details used across the public site and emails."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="font-semibold">Logo</h2>
          <div className="mt-4">
            <LogoManager
              assets={logoAssets}
              activeLightLogoId={settings.activeLightLogoId}
              activeDarkLogoId={settings.activeDarkLogoId}
            />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Company details</h2>
          <div className="mt-4">
            <SettingsForm settings={settings} />
          </div>
        </Card>
      </div>
    </div>
  );
}
