import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { StartProjectTrigger } from "./StartProjectTrigger";
import { MobileMenu } from "./MobileMenu";
import { PrimaryNav } from "./PrimaryNav";
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
}: {
  locale: Locale;
  companyName: string;
}) {
  const dict = getDictionary(locale);

  const navItems = NAV_ITEMS.map((item) => ({
    ...item,
    label: dict.nav[item.key],
  }));

  return (
    <header className="public-header">
      <Container className="public-nav-container flex h-[64px] items-center justify-between gap-6">
        <Link href="/#home" className="shrink-0">
          <Logo name={companyName} />
        </Link>

        <PrimaryNav items={navItems} className="hidden lg:flex" />

        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="/login"
            className="text-xs font-display text-foreground/80 transition-colors hover:text-foreground"
          >
            {locale === "ar" ? "تسجيل الدخول" : "Sign in"}
          </Link>
          <span className="nav-divider" aria-hidden="true" />
          <LanguageToggle locale={locale} />
          <span className="nav-divider" aria-hidden="true" />
          <StartProjectTrigger className="btn btn-primary">
            {dict.nav.startProject}
          </StartProjectTrigger>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle locale={locale} />
          <MobileMenu locale={locale} navItems={NAV_ITEMS} />
        </div>
      </Container>
    </header>
  );
}
