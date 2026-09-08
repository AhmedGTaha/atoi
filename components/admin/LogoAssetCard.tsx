"use client";

import Image from "next/image";
import type { LogoAsset } from "@prisma/client";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb > 100 ? 0 : 1)} KB`;
  return `${(kb / 1024).toFixed((kb / 1024) > 10 ? 0 : 1)} MB`;
}

export function LogoAssetCard({
  asset,
  isLight,
  isDark,
  disabled,
  onSetLight,
  onSetDark,
  onDelete,
}: {
  asset: LogoAsset;
  isLight: boolean;
  isDark: boolean;
  disabled: boolean;
  onSetLight: () => void;
  onSetDark: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="logo-asset-card">
      <div className="logo-asset-thumb">
        <Image
          src={asset.publicUrl}
          alt={asset.fileName ? `Preview of ${asset.fileName}` : "Uploaded logo preview"}
          fill
          sizes="140px"
          className="object-contain"
        />
      </div>
      <div className="logo-asset-file">
        <strong title={asset.fileName ?? undefined}>
          {asset.fileName || "Untitled logo"}
        </strong>
        <span>{asset.fileSize ? formatBytes(asset.fileSize) : "Size unknown"}</span>
      </div>
      <div className="logo-mode-actions">
        <ModeControl
          label="Light"
          active={isLight}
          disabled={disabled}
          onAssign={onSetLight}
        />
        <ModeControl
          label="Dark"
          active={isDark}
          disabled={disabled}
          onAssign={onSetDark}
        />
      </div>
      <button
        type="button"
        className="logo-asset-delete"
        disabled={disabled}
        aria-label={`Delete ${asset.fileName || "logo"}`}
        title={`Delete ${asset.fileName || "logo"}`}
        onClick={onDelete}
      >
        <TrashIcon />
        <span>Delete</span>
      </button>
    </div>
  );
}

function ModeControl({
  label,
  active,
  disabled,
  onAssign,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onAssign: () => void;
}) {
  if (active) {
    return (
      <button
        type="button"
        className="logo-mode-badge"
        disabled={disabled}
        onClick={onAssign}
        aria-label={`Currently the ${label.toLowerCase()}-mode logo — click to unassign`}
      >
        <CheckIcon />
        {label} logo
      </button>
    );
  }
  return (
    <button
      type="button"
      className="logo-mode-button"
      disabled={disabled}
      onClick={onAssign}
      aria-label={`Set as ${label.toLowerCase()}-mode logo`}
    >
      Set {label.toLowerCase()}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8.5 6.2 12 13 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4h10m-6.5 3v4m3-4v4M5 4l.7-2h4.6l.7 2m-6.3 0 .55 9h5.5l.55-9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
