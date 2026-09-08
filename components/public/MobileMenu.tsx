"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locale";
import { useStartProjectModal } from "./StartProjectModalContext";

interface NavItem {
  href: string;
  key: string;
  label: string;
}

export function MobileMenu({
  locale,
  navItems,
  onLocaleChange,
}: {
  locale: Locale;
  navItems: NavItem[];
  onLocaleChange?: (locale: Locale) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const dict = getDictionary(locale);
  const { open: openProjectModal } = useStartProjectModal();
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  return (
    <div className="mobile-nav-root" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? dict.nav.close : dict.nav.menu}
        className="icon-button"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div id={panelId} role="menu" className="mobile-nav-panel">
          <nav className="mobile-nav-links" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={close}
                role="menuitem"
                className="mobile-nav-link"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={close}
              role="menuitem"
              className="mobile-nav-link"
            >
              {locale === "ar" ? "تسجيل الدخول" : "Sign in"}
            </Link>
          </nav>

          <div className="mobile-nav-footer">
            <LanguageToggle
              locale={locale}
              className="mobile-nav-language"
              onLocaleChange={onLocaleChange}
            />
            <button
              type="button"
              onClick={() => {
                close();
                openProjectModal();
              }}
              className="btn btn-primary w-full"
            >
              {dict.nav.startProject}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path d="M0 1H16M0 6H16M0 11H16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M1 1L13 13M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
