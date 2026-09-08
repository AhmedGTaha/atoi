"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections: Record<string, string> = {
  requests: "Requests",
  projects: "Projects",
  customers: "Customers",
  portfolio: "Previous Work",
  content: "Website Content",
  settings: "Settings",
  team: "Team",
};

export function AdminBreadcrumbs() {
  const segments = usePathname().split("/").filter(Boolean);
  if (segments.length < 3) return null;
  const section = segments[1];
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-5 flex flex-wrap gap-3 text-xs text-muted"
    >
      <Link href="/admin" className="hover:text-accent-foreground">
        Admin
      </Link>
      <span aria-hidden="true">/</span>
      <Link href={`/admin/${section}`} className="hover:text-accent-foreground">
        {sections[section] ?? section}
      </Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">
        {segments[2] === "new" ? "New project" : "Details"}
      </span>
    </nav>
  );
}
