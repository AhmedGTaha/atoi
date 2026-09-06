"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/portfolio", label: "Previous Work" },
  { href: "/admin/content", label: "Website Content" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="app-nav" aria-label="Admin">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
