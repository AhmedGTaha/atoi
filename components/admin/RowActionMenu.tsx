"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EllipsisIcon, TrashIcon } from "./icons";

export function RowActionMenu({
  ariaLabel,
  deleteLabel,
  onDelete,
}: {
  ariaLabel: string;
  deleteLabel: string;
  onDelete: () => void;
}) {
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const open = coords !== null;

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      )
        return;
      setCoords(null);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setCoords(null);
    }
    function closeOnViewportChange() {
      setCoords(null);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", closeOnViewportChange, true);
    window.addEventListener("resize", closeOnViewportChange);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", closeOnViewportChange, true);
      window.removeEventListener("resize", closeOnViewportChange);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        className="icon-action-btn"
        aria-label="More actions"
        title="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          if (open) {
            setCoords(null);
            return;
          }
          const rect = triggerRef.current?.getBoundingClientRect();
          if (rect)
            setCoords({
              top: rect.bottom + 4,
              right: window.innerWidth - rect.right,
            });
        }}
      >
        <EllipsisIcon />
      </button>
      {coords &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={ariaLabel}
            className="row-menu"
            style={{ position: "fixed", top: coords.top, right: coords.right }}
          >
            <button
              type="button"
              role="menuitem"
              className="row-menu-item"
              onClick={() => {
                setCoords(null);
                onDelete();
              }}
            >
              <TrashIcon />
              {deleteLabel}
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
