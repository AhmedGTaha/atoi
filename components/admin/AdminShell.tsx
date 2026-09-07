import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { AdminNav } from "./AdminNav";
import { logoutAction } from "@/app/actions/authActions";

export function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link href="/admin" className="brand">
          ATOI <span className="section-marker">/ Admin</span>
        </Link>
        <Link
          href="/"
          className="mt-3 block text-xs text-muted hover:text-foreground"
        >
          ← Public website
        </Link>
        <div className="mt-6">
          <AdminNav />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="app-topbar">
          <p className="text-sm text-muted">
            Signed in as{" "}
            <span className="font-semibold text-foreground">{adminName}</span>
          </p>
          <div className="flex items-center gap-4">
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
        </header>
        <main id="main-content" className="app-main">
          <AdminBreadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
