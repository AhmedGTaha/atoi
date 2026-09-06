"use client";

import { useCallback, useId, useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locale";
import { useStartProjectModal } from "./StartProjectModalContext";

interface NavItem {
  href: string;
  key: "home" | "services" | "work" | "about" | "contact";
}

export function MobileMenu({
  locale,
  navItems,
}: {
  locale: Locale;
  navItems: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const close = useCallback(() => setOpen(false), []);
  const dict = getDictionary(locale);
  const { open: openProjectModal } = useStartProjectModal();
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={dict.nav.menu}
        className="btn btn-secondary px-3"
      >
        <svg
          width="18"
          height="14"
          viewBox="0 0 18 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 1H18M0 7H18M0 13H18"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
      <Modal
        isOpen={open}
        onClose={close}
        titleId={titleId}
        className="max-w-md p-6"
      >
        <div className="flex items-center justify-between border-b pb-4">
          <h2 id={titleId} className="brand">
            {dict.nav.menu}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label={dict.nav.close}
            className="btn btn-secondary px-4"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col py-4" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={close}
              className="border-b py-3 font-display text-2xl"
            >
              {dict.nav[item.key]}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={close}
            className="border-b py-3 font-display text-2xl"
          >
            {locale === "ar" ? "تسجيل الدخول" : "Sign in"}
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            openProjectModal();
          }}
          className="btn btn-primary w-full"
        >
          {dict.nav.startProject}
        </button>
      </Modal>
    </>
  );
}
