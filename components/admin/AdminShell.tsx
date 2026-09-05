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
    <div className="min-h-dvh bg-cream-dim/40 lg:flex">
      <aside className="border-b border-black/10 bg-white p-5 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-e lg:p-6">
        <Link href="/admin" className="text-xl font-extrabold tracking-tight">
          atrio <span className="text-ink/40">admin</span>
        </Link>
        <div className="mt-6">
          <AdminNav />
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4 lg:px-8">
          <p className="text-sm text-ink/60">
            Signed in as <span className="font-semibold text-ink">{adminName}</span>
          </p>
          <form action={logoutAdminAction}>
            <button type="submit" className="text-sm font-semibold text-ink/70 hover:text-ink">
              Sign out
            </button>
          </form>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
