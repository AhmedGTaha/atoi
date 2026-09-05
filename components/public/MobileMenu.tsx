"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locale";
import { useStartProjectModal } from "./StartProjectModalContext";

interface NavItem {
  href: string;
  key: "home" | "services" | "work" | "about" | "contact";
}

export function MobileMenu({ locale, navItems }: { locale: Locale; navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const dict = getDictionary(locale);
  const { open: openProjectModal } = useStartProjectModal();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={dict.nav.menu}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
          <path d="M0 1H18M0 7H18M0 13H18" stroke="black" strokeWidth="1.6" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.menu}
          className="fixed inset-0 z-50 flex flex-col bg-cream"
        >
          <div className="flex h-[76px] items-center justify-end px-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.nav.close}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M1 1L15 15M15 1L1 15" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-black/10 py-4 text-2xl font-semibold"
              >
                {dict.nav[item.key]}
              </Link>
            ))}
          </nav>
          <div className="p-6">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openProjectModal();
              }}
              className="flex min-h-12 w-full items-center justify-center rounded-full bg-blue-dark text-base font-semibold text-white"
            >
              {dict.nav.startProject}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
