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
  return (
    <div className="studio-statusbar">
      <span className="status">~/{section}</span>
      <a href={`mailto:${email}`}>{email}</a>
    </div>
  );
}
