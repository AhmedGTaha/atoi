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
    <div className="min-h-dvh bg-cream-dim/30">
      <header className="border-b border-black/10 bg-cream">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link href="/portal">
            <Logo name={companyName} />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle locale={locale} />
            <form action={logoutCustomerAction}>
              <button type="submit" className="text-sm font-semibold text-ink/70 hover:text-ink">
                {dict.portal.signOut}
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-8">{children}</main>
    </div>
  );
}
