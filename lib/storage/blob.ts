import "server-only";
import { put, del } from "@vercel/blob";
import { randomUUID } from "crypto";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
} from "@/lib/validation/portfolio";

export interface UploadedAsset {
  storageKey: string;
  publicUrl: string;
}

export interface FileValidationError {
  ok: false;
  error: string;
}

/**
 * Validates an uploaded image's declared type and size. Filenames are never
 * trusted: a random key is generated instead of using the client-supplied
 * name, and only a fixed allow-list of image MIME types is accepted.
 */
export function validateImageFile(file: File): { ok: true } | FileValidationError {
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return { ok: false, error: "Only JPEG, PNG, WebP or AVIF images are allowed." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Image must be smaller than 8MB." };
  }
  if (file.size === 0) {
    return { ok: false, error: "The uploaded file is empty." };
  }
  return { ok: true };
}

function extensionFor(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    default:
      return "bin";
  }
}

/**
 * Persists an image to Vercel Blob storage (durable, Vercel-compatible;
 * never the local filesystem). Isolated here so the storage backend can be
 * swapped later without touching callers.
 */
export async function uploadPortfolioImage(
  file: File,
  folder: "portfolio" | "logo" = "portfolio"
): Promise<UploadedAsset> {
  const key = `${folder}/${randomUUID()}.${extensionFor(file.type)}`;
  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type,
  });
  return { storageKey: blob.pathname, publicUrl: blob.url };
}

export async function deletePortfolioImage(publicUrl: string): Promise<void> {
  try {
    await del(publicUrl);
  } catch (err) {
    console.error("[storage] Failed to delete blob:", err);
  }
}
