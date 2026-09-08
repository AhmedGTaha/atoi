import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Logo } from "@/components/public/Logo";
import { logoutAction } from "@/app/actions/authActions";

export function TeamShell({
  companyName,
  memberName,
  children,
}: {
  companyName: string;
  memberName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="portal-shell min-h-dvh">
      <header className="border-b border-rule bg-canvas">
        <div className="site-container flex flex-wrap items-center justify-between gap-4 py-4">
          <Link href="/team">
            <Logo name={companyName} />
          </Link>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted">
              Signed in as <span className="font-semibold text-foreground">{memberName}</span>
            </p>
            <ThemeToggle />
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-sm font-semibold text-foreground/70 hover:text-foreground"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="site-container border-b py-3 flex justify-between text-sm">
        <Link href="/team" className="text-accent-foreground">
          Your projects
        </Link>
        <Link href="/" className="text-muted">
          Public website ↗
        </Link>
      </div>
      <main id="main-content" className="site-container app-main">
        {children}
      </main>
    </div>
  );
}
