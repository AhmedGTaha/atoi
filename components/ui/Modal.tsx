"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  isOpen,
  onClose,
  titleId,
  children,
  className,
  overlayClassName,
  restoreFocusTo,
}: {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  restoreFocusTo?: React.MutableRefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused =
      restoreFocusTo?.current ?? (document.activeElement as HTMLElement | null);
    const dialog = dialogRef.current;
    const siblings = Array.from(document.body.children).filter(
      (el): el is HTMLElement =>
        el instanceof HTMLElement && !el.contains(dialog),
    );
    const previousInert = siblings.map((el) => el.inert);
    siblings.forEach((el) => {
      el.inert = true;
    });
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable?.length) focusable[0].focus();
    else dialog?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialog) return;

      const nodes = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null);
      if (nodes.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }

      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = originalOverflow;
      siblings.forEach((el, index) => {
        el.inert = previousInert[index];
      });
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose, restoreFocusTo]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <div
        className={clsx(
          "absolute inset-0 bg-overlay backdrop-blur-sm",
          overlayClassName,
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby={titleId}
        className={clsx(
          "studio-dialog relative z-10 w-full max-h-[90dvh] overflow-y-auto",
          "animate-[modal-in_0.18s_ease-out]",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
