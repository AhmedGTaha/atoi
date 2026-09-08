"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { LogoAsset } from "@prisma/client";
import {
  uploadLogoAction,
  setActiveLogoAction,
  unsetActiveLogoAction,
  deleteLogoAssetAction,
} from "@/app/actions/settingsActions";
import { LogoAssetCard } from "@/components/admin/LogoAssetCard";
import { DeleteLogoModal } from "@/components/admin/DeleteLogoModal";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

type PreviewMode = "light" | "dark" | "icon";

export function LogoManager({
  assets,
  activeLightLogoId,
  activeDarkLogoId,
  activeAppIconId,
}: {
  assets: LogoAsset[];
  activeLightLogoId: string | null;
  activeDarkLogoId: string | null;
  activeAppIconId: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [previewMode, setPreviewMode] = useState<PreviewMode>("light");
  const [deleteTarget, setDeleteTarget] = useState<LogoAsset | null>(null);

  const activeLightLogo = assets.find((asset) => asset.id === activeLightLogoId) ?? null;
  const activeDarkLogo = assets.find((asset) => asset.id === activeDarkLogoId) ?? null;
  const activeAppIcon = assets.find((asset) => asset.id === activeAppIconId) ?? null;
  const previewAsset =
    previewMode === "light" ? activeLightLogo : previewMode === "dark" ? activeDarkLogo : activeAppIcon;

  function submitFile(file: File) {
    if (!ACCEPTED_TYPES.has(file.type)) {
      setError("Only PNG, JPG and WebP images are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be 5MB or smaller.");
      return;
    }
    setError(undefined);
    const formData = new FormData();
    formData.set("logo", file);
    startTransition(async () => {
      const state = await uploadLogoAction({}, formData);
      if (state.error) setError(state.error);
      else router.refresh();
    });
  }

  function assign(assetId: string, mode: PreviewMode) {
    startTransition(async () => {
      await setActiveLogoAction(assetId, mode);
      router.refresh();
    });
  }

  function unassign(mode: PreviewMode) {
    startTransition(async () => {
      await unsetActiveLogoAction(mode);
      router.refresh();
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    startTransition(async () => {
      await deleteLogoAssetAction(id);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="logo-manager">
      <div
        className="logo-preview-toggle content-language-toggle content-language-toggle--compact"
        role="group"
        aria-label="Preview logo or app icon"
      >
        <button
          type="button"
          aria-pressed={previewMode === "light"}
          onClick={() => setPreviewMode("light")}
        >
          Light mode
        </button>
        <button
          type="button"
          aria-pressed={previewMode === "dark"}
          onClick={() => setPreviewMode("dark")}
        >
          Dark mode
        </button>
        <button
          type="button"
          aria-pressed={previewMode === "icon"}
          onClick={() => setPreviewMode("icon")}
        >
          App icon
        </button>
      </div>

      <div
        className="logo-preview-stage"
        data-preview-mode={previewMode}
        aria-live="polite"
      >
        {previewAsset ? (
          <Image
            src={previewAsset.publicUrl}
            alt={previewMode === "icon" ? "Active app icon" : `Active ${previewMode}-mode logo`}
            width={previewMode === "icon" ? 48 : 160}
            height={48}
            className={previewMode === "icon" ? "h-12 w-12 object-contain" : "h-10 w-auto object-contain"}
          />
        ) : previewMode === "icon" ? (
          <span className="logo-preview-empty">
            No app icon assigned — the default ATOI icon is used for the favicon and app icon.
          </span>
        ) : (
          <span className="logo-preview-empty">
            No {previewMode}-mode logo assigned — the ATOI wordmark is shown instead.
          </span>
        )}
      </div>

      <p className="logo-manager-label">Uploaded files</p>
      <p className="logo-manager-hint">
        Upload a logo or app icon below, then assign it as the light-mode logo, dark-mode
        logo, and/or app icon (used for the favicon, browser tab icon, and home-screen
        icon). A square image works best for the app icon.
      </p>

      {assets.length > 0 ? (
        <div className="logo-asset-grid">
          {assets.map((asset) => (
            <LogoAssetCard
              key={asset.id}
              asset={asset}
              isLight={asset.id === activeLightLogoId}
              isDark={asset.id === activeDarkLogoId}
              isIcon={asset.id === activeAppIconId}
              disabled={isPending}
              onSetLight={() =>
                asset.id === activeLightLogoId ? unassign("light") : assign(asset.id, "light")
              }
              onSetDark={() =>
                asset.id === activeDarkLogoId ? unassign("dark") : assign(asset.id, "dark")
              }
              onSetIcon={() =>
                asset.id === activeAppIconId ? unassign("icon") : assign(asset.id, "icon")
              }
              onDelete={() => setDeleteTarget(asset)}
            />
          ))}
        </div>
      ) : (
        <p className="logo-manager-empty">No logos or icons uploaded yet.</p>
      )}

      {error && (
        <p role="alert" className="portfolio-upload-error">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        aria-label="Upload logo or app icon"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        disabled={isPending}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) submitFile(file);
        }}
      />
      <button
        type="button"
        className="btn btn-secondary logo-upload-trigger"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isPending ? "Uploading…" : "+ Upload logo or icon"}
      </button>

      <DeleteLogoModal
        target={deleteTarget}
        isLight={deleteTarget?.id === activeLightLogoId}
        isDark={deleteTarget?.id === activeDarkLogoId}
        isIcon={deleteTarget?.id === activeAppIconId}
        isPending={isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
