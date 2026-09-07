"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { Modal } from "@/components/ui/Modal";

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
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const close = useCallback(() => setOpen(false), []);

  const navigation = (
    <nav className="app-nav" aria-label="Admin">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={close}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
  return (
    <>
      <div className="hidden lg:block">{navigation}</div>
      <button
        type="button"
        className="btn btn-secondary lg:hidden"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        Menu /{" "}
        {NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "Details"}
      </button>
      <Modal
        isOpen={open}
        onClose={close}
        titleId={titleId}
        className="max-w-sm p-5"
      >
        <div className="panel-strip mb-4">
          <h2 id={titleId} className="text-sm">
            atoi / navigation
          </h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close menu"
            onClick={close}
          >
            ×
          </button>
        </div>
        {navigation}
      </Modal>
    </>
  );
}
