"use client";

import { useActionState } from "react";
import {
  setPasswordAction,
  type SetPasswordState,
} from "@/app/actions/authActions";
import { AuthInput } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";

const initialState: SetPasswordState = {};

export function SetPasswordForm({
  token,
  mode,
}: {
  token: string;
  mode?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    setPasswordAction,
    initialState,
  );
  const submitLabel = mode === "team" ? "Set password & sign in" : "Set password";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <AuthInput
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      <AuthInput
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
