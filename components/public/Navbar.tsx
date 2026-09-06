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

export function Navbar({ locale, companyName }: { locale: Locale; companyName: string }) {
  const dict = getDictionary(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-cream/90 backdrop-blur">
      <Container className="flex h-[66px] items-center justify-between gap-4">
        <Link href="/#home" className="shrink-0">
          <Logo name={companyName} />
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-8 lg:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="text-xs uppercase tracking-wider font-medium text-ink/80 transition-colors hover:text-ink"
            >
              {dict.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/login" className="text-xs uppercase tracking-wider text-blue-dark">{locale === "ar" ? "تسجيل الدخول" : "Sign in"}</Link>
          <LanguageToggle locale={locale} />
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
