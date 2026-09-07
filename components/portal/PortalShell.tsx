import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Logo } from "@/components/public/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { logoutCustomerAction } from "@/app/actions/customerAuthActions";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function PortalShell({
  locale,
  companyName,
  children,
}: {
  locale: Locale;
  companyName: string;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);

  return (
    <div className="portal-shell min-h-dvh">
      <header className="border-b border-rule bg-canvas">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/portal">
            <Logo name={companyName} />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle locale={locale} />
            <LanguageToggle locale={locale} />
            <form action={logoutCustomerAction}>
              <button
                type="submit"
                className="text-sm font-semibold text-foreground/70 hover:text-foreground"
              >
                {dict.portal.signOut}
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="site-container border-b py-3 flex justify-between text-sm">
        <Link href="/portal" className="text-accent">
          {dict.portal.yourProjects}
        </Link>
        <Link href="/" className="text-muted">
          {locale === "ar" ? "الموقع الرئيسي" : "Public website"} ↗
        </Link>
      </div>
      <main id="main-content" className="site-container app-main">
        {children}
      </main>
    </div>
  );
}
