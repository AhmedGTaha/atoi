import Link from "next/link";
import { BlueprintPanel } from "@/components/ui/BlueprintPanel";
import { getLocale } from "@/lib/i18n/getLocale";

export default async function NotFound() {
  const ar = (await getLocale()) === "ar";
  return (
    <main id="main-content" className="site-container py-16">
      <BlueprintPanel className="max-w-xl p-8">
        <p className="section-marker mb-4">ATOI / 404</p>
        <h1>{ar ? "الصفحة غير موجودة" : "Page not found"}</h1>
        <p className="my-6 text-muted">
          {ar
            ? "تحقق من الرابط أو عد إلى الصفحة الرئيسية."
            : "Check the address or return to the website to continue."}
        </p>
        <Link href="/" className="btn btn-primary">
          {ar ? "الرئيسية" : "Back home"}
        </Link>
      </BlueprintPanel>
    </main>
  );
}
