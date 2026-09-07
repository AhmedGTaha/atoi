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
    <footer id="footer" className="studio-footer border-t">
      <Container className="flex flex-wrap items-center gap-4 py-8 font-display text-xs text-faint sm:gap-8">
        <Logo name={settings.companyName} logoUrl={settings.logoPublicUrl} />
        <a href={`mailto:${settings.companyEmail}`} className="hover:text-foreground" dir="ltr">
          {settings.companyEmail}
        </a>
        <a
          href={`tel:${settings.companyPhone.replace(/\s/g, "")}`}
          className="hover:text-foreground"
          dir="ltr"
        >
          {settings.companyPhone}
        </a>
        {settings.whatsappPhone && (
          <a
            href={`https://wa.me/${settings.whatsappPhone.replace(/[^\d]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            {dict.footer.whatsapp}
          </a>
        )}
        {settings.instagramUrl && (
          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            {dict.footer.instagram}
          </a>
        )}
        {settings.linkedinUrl && (
          <a
            href={settings.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            {dict.footer.linkedin}
          </a>
        )}
        <span className="ms-auto">
          © {new Date().getFullYear()} {settings.companyName} — {location} ·{" "}
          {t(content, "footer.tagline", locale)}
        </span>
      </Container>
    </footer>
  );
}
