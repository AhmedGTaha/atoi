"use client";

import { useActionState } from "react";
import {
  setPasswordAction,
  type SetPasswordState,
} from "@/app/actions/authActions";
import { AuthInput } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getErrorMessage, isErrorCode } from "@/lib/i18n/errors";

const initialState: SetPasswordState = {};

export function SetPasswordForm({
  token,
  mode,
  locale,
}: {
  token: string;
  mode?: string;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const [state, formAction, isPending] = useActionState(
    setPasswordAction,
    initialState,
  );
  const submitLabel =
    mode === "team" ? dict.auth.setPassword.submitTeam : dict.auth.setPassword.submit;

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <AuthInput
        label={dict.auth.setPassword.newPasswordLabel}
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      <AuthInput
        label={dict.auth.setPassword.confirmPasswordLabel}
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
      />
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {isErrorCode(state.error)
            ? getErrorMessage(locale, state.error)
            : state.error}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? dict.auth.setPassword.submitting : submitLabel}
      </Button>
    </form>
  );
}
