import { requireAdmin } from "@/lib/auth/guards";
import {
  getWebsiteContentForAdmin,
  websiteContentFieldDefinitions,
} from "@/lib/services/websiteContentService";
import { PageHeader } from "@/components/admin/ui";
import { WebsiteContentForm } from "@/components/admin/WebsiteContentForm";

export default async function AdminContentPage() {
  await requireAdmin();
  const [content, fields] = await Promise.all([
    getWebsiteContentForAdmin(),
    Promise.resolve(websiteContentFieldDefinitions()),
  ]);

  return (
    <div>
      <PageHeader
        title="Website Content"
        description="Edit each language and review unpublished changes on the real public website."
      />
      <WebsiteContentForm fields={fields} content={content} />
    </div>
  );
}
