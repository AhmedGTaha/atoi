"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

interface NavItem {
  href: string;
  key: string;
  label: string;
}

export function PrimaryNav({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(
    items[0]?.href.replace("/#", "") ?? null,
  );

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.href.replace("/#", "")))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={clsx("nav-primary", className)} aria-label="Primary">
      {items.map((item) => {
        const id = item.href.replace("/#", "");
        const isActive = activeId === id;
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={clsx("nav-link", isActive && "nav-link-active")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
