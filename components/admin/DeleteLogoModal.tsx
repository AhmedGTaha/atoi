"use client";

import { useId } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { LogoAsset } from "@prisma/client";

export function DeleteLogoModal({
  target,
  isLight,
  isDark,
  isPending,
  onClose,
  onConfirm,
}: {
  target: LogoAsset | null;
  isLight: boolean;
  isDark: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const assignments = [
    isLight && "light-mode",
    isDark && "dark-mode",
  ].filter(Boolean) as string[];

  return (
    <Modal isOpen={target !== null} onClose={onClose} titleId={titleId} className="max-w-md">
      <div className="panel-strip">
        <span className="text-danger">atoi / confirmation</span>
        <button
          className="icon-button"
          type="button"
          aria-label="Close confirmation"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="p-6">
        <h2 id={titleId} className="text-xl">
          Delete {target?.fileName || "this logo"}?
        </h2>
        {assignments.length > 0 ? (
          <p className="mt-3 text-muted">
            This logo is currently assigned as the {assignments.join(" and ")}{" "}
            logo. Deleting it will clear that assignment — the public site will
            fall back to the ATOI wordmark until you assign a replacement.
            This cannot be undone.
          </p>
        ) : (
          <p className="mt-3 text-muted">
            This permanently removes the uploaded file. This cannot be undone.
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" disabled={isPending} onClick={onConfirm}>
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
