import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guards";
import { getWebsiteContentForAdmin } from "@/lib/services/websiteContentService";
import { getCompanySettings } from "@/lib/services/settingsService";
import { getPublishedPortfolio } from "@/lib/services/portfolioService";
import { WebsiteContentPreview } from "@/components/admin/WebsiteContentPreview";

export const metadata: Metadata = {
  title: "Website preview — ATOI Admin",
  robots: { index: false, follow: false },
};

export default async function WebsiteContentPreviewPage() {
  await requireAdmin();
  const [content, settings, portfolio] = await Promise.all([
    getWebsiteContentForAdmin(),
    getCompanySettings(),
    getPublishedPortfolio(),
  ]);

  return (
    <WebsiteContentPreview
      initialContent={content}
      settings={settings}
      portfolio={portfolio}
    />
  );
}
