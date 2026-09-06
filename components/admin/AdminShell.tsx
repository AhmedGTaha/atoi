import Link from "next/link";
import { AdminNav } from "./AdminNav";
import { logoutAdminAction } from "@/app/actions/adminAuthActions";

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
        <Link href="/" className="mt-3 block text-xs text-muted hover:text-ink">← Public website</Link>
        <div className="mt-6">
          <AdminNav />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="app-topbar">
          <p className="text-sm text-muted">
            Signed in as <span className="font-semibold text-ink">{adminName}</span>
          </p>
          <form action={logoutAdminAction}>
            <button type="submit" className="text-sm font-semibold text-ink/70 hover:text-ink">
              Sign out
            </button>
          </form>
        </header>
        <main id="main-content" className="app-main">{children}</main>
      </div>
    </div>
  );
}
