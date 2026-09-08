import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { StartProjectTrigger } from "./StartProjectTrigger";
import { MobileMenu } from "./MobileMenu";
import { PrimaryNav } from "./PrimaryNav";
import { ScrollHeader } from "./ScrollHeader";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

const NAV_ITEMS = [
  { href: "/#work", key: "work" as const },
  { href: "/#services", key: "services" as const },
  { href: "/#about", key: "about" as const },
];

export function Navbar({
  locale,
  companyName,
  lightLogoUrl,
  darkLogoUrl,
  previewMode = false,
  onLocaleChange,
}: {
  locale: Locale;
  companyName: string;
  lightLogoUrl?: string | null;
  darkLogoUrl?: string | null;
  previewMode?: boolean;
  onLocaleChange?: (locale: Locale) => void;
}) {
  const dict = getDictionary(locale);

  const navItems = NAV_ITEMS.map((item) => ({
    ...item,
    href: previewMode ? item.href.replace("/", "") : item.href,
    label: dict.nav[item.key],
  }));

  return (
    <ScrollHeader>
      <Container className="public-nav-container">
        <Link
          href={previewMode ? "#home" : "/#home"}
          className="public-brand-link"
        >
          <Logo
            name={companyName}
            lightLogoUrl={lightLogoUrl}
            darkLogoUrl={darkLogoUrl}
          />
        </Link>

        <PrimaryNav items={navItems} className="hidden lg:flex" />

        <div className="public-nav-actions hidden lg:flex">
          <Link href="/login" className="public-sign-in">
            {dict.nav.signIn}
          </Link>
          <span className="nav-divider" aria-hidden="true" />
          <LanguageToggle
            locale={locale}
            className="public-language-toggle"
            onLocaleChange={onLocaleChange}
          />
          <StartProjectTrigger className="btn btn-primary public-project-trigger">
            {dict.nav.startProject}
          </StartProjectTrigger>
        </div>

        <MobileMenu
          locale={locale}
          navItems={navItems}
          onLocaleChange={onLocaleChange}
          className="justify-self-end lg:hidden"
        />
      </Container>
    </ScrollHeader>
  );
}
