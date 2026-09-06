"use client";

import { useActionState } from "react";
import {
  setPasswordAction,
  type SetPasswordState,
} from "@/app/actions/customerAuthActions";
import { AuthInput } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";

const initialState: SetPasswordState = {};

export function SetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    setPasswordAction,
    initialState,
  );

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
        variant="primaryBlue"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Saving…" : "Set password"}
      </Button>
    </form>
  );
}
