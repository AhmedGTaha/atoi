import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { StartProjectTrigger } from "./StartProjectTrigger";
import { MobileMenu } from "./MobileMenu";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

const NAV_ITEMS = [
  { href: "/#home", key: "home" as const },
  { href: "/#services", key: "services" as const },
  { href: "/#work", key: "work" as const },
  { href: "/#about", key: "about" as const },
  { href: "/#contact", key: "contact" as const },
];

export function Navbar({
  locale,
  companyName,
}: {
  locale: Locale;
  companyName: string;
}) {
  const dict = getDictionary(locale);

  return (
    <header className="public-header">
      <Container className="flex h-[58px] items-center justify-between gap-4">
        <Link href="/#home" className="shrink-0">
          <Logo name={companyName} />
        </Link>

        <nav
          className="hidden items-center gap-5 xl:gap-6 lg:flex"
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-xs font-display font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {dict.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="text-xs font-display text-accent">
            {locale === "ar" ? "تسجيل الدخول" : "Sign in"}
          </Link>
          <ThemeToggle locale={locale} />
          <LanguageToggle locale={locale} />
          <StartProjectTrigger className="btn btn-primary">
            {dict.nav.startProject}
          </StartProjectTrigger>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle locale={locale} />
          <LanguageToggle locale={locale} />
          <MobileMenu locale={locale} navItems={NAV_ITEMS} />
        </div>
      </Container>
    </header>
  );
}
