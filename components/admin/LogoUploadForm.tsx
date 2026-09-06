"use client";

import { useActionState } from "react";
import Image from "next/image";
import {
  uploadLogoAction,
  type LogoUploadState,
} from "@/app/actions/settingsActions";
import { Button } from "@/components/ui/Button";

const initialState: LogoUploadState = {};

export function LogoUploadForm({
  currentLogoUrl,
}: {
  currentLogoUrl: string | null;
}) {
  const [state, formAction, isPending] = useActionState(
    uploadLogoAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-3">
      {currentLogoUrl && (
        <Image
          src={currentLogoUrl}
          alt="Current logo"
          width={140}
          height={40}
          className="h-10 w-auto object-contain"
        />
      )}
      <input
        type="file"
        aria-label="Company logo"
        name="logo"
        accept="image/png,image/jpeg,image/webp,image/avif"
        required
        className="block text-sm"
      />
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-success">
          Logo updated.
        </p>
      )}
      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? "Uploading…" : "Upload logo"}
      </Button>
    </form>
  );
}
