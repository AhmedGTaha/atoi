"use client";

import { StartProjectModalContextProvider } from "./StartProjectModalContext";
import { StartProjectModal } from "./StartProjectModal";
import type { Locale } from "@/lib/i18n/locale";

export function StartProjectModalProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <StartProjectModalContextProvider>
      {children}
      <StartProjectModal locale={locale} />
    </StartProjectModalContextProvider>
  );
}
