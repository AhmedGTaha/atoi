"use client";

import { useEffect, useState } from "react";

export function StatusBar({ email }: { email: string }) {
  const [section, setSection] = useState("home");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setSection(entry.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".studio-statusbar");
    if (!bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty(
        "--page-progress",
        `${max > 0 ? Math.min(1, window.scrollY / max) : 0}`,
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="studio-statusbar">
      <span className="status">~/{section}</span>
      <a href={`mailto:${email}`}>{email}</a>
    </div>
  );
}
