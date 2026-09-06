import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import type { Locale } from "@/lib/i18n/locale";
import type { WebsiteContentMap } from "@/lib/services/websiteContentService";
import { t } from "@/lib/content/helpers";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { CompanySettings } from "@prisma/client";

export function Footer({
  locale,
  content,
  settings,
}: {
  locale: Locale;
  content: WebsiteContentMap;
  settings: CompanySettings;
}) {
  const dict = getDictionary(locale);
  const location = locale === "ar" ? settings.locationAr : settings.locationEn;

  return (
    <footer id="footer" className="border-t bg-cream-dim py-12">
      <Container className="flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Logo name={settings.companyName} logoUrl={settings.logoPublicUrl} />
          <p className="mt-4 text-muted">
            {t(content, "footer.tagline", locale)}
          </p>
          <p className="mt-1 text-muted">{location}</p>
        </div>

        <div className="flex flex-wrap gap-12">
          <div>
            <p className="text-sm font-bold text-muted">
              {dict.footer.contactHeading}
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={`mailto:${settings.companyEmail}`}
                  className="hover:underline"
                  dir="ltr"
                >
                  {settings.companyEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.companyPhone.replace(/\s/g, "")}`}
                  className="hover:underline"
                  dir="ltr"
                >
                  {settings.companyPhone}
                </a>
              </li>
              {settings.whatsappPhone && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsappPhone.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {dict.footer.whatsapp}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {(settings.instagramUrl || settings.linkedinUrl) && (
            <div>
              <p className="text-sm font-bold text-muted">
                {dict.footer.elsewhereHeading}
              </p>
              <ul className="mt-3 space-y-2">
                {settings.instagramUrl && (
                  <li>
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {dict.footer.instagram}
                    </a>
                  </li>
                )}
                {settings.linkedinUrl && (
                  <li>
                    <a
                      href={settings.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {dict.footer.linkedin}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </Container>

      <Container className="mt-10 border-t border-rule pt-6">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {settings.companyName}.{" "}
          {dict.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
