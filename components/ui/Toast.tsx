"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

export interface ToastMessage {
  id: number;
  text: string;
  tone: "success" | "danger";
}

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "fixed bottom-6 end-6 z-50 max-w-sm border bg-surface px-4 py-3 text-sm shadow-[var(--shadow-modal)]",
        toast.tone === "success" ? "border-success text-success" : "border-danger text-danger",
      )}
    >
      {toast.text}
    </div>,
    document.body,
  );
}
