"use client";

import { useEffect, type ReactNode } from "react";

export function ScrollHeader({ children }: { children: ReactNode }) {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".public-header");
    if (!header) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      header.toggleAttribute("data-scrolled", window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return <header className="public-header">{children}</header>;
}
