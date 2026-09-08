"use client";

import { useActionState } from "react";
import {
  forgotPasswordAction,
  type ForgotPasswordState,
} from "@/app/actions/authActions";
import { AuthInput } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getErrorMessage, isErrorCode } from "@/lib/i18n/errors";

const initialState: ForgotPasswordState = {};

export function ForgotPasswordForm({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialState,
  );

  if (state.submitted) {
    return (
      <p className="text-foreground/70">
        {dict.auth.forgotPassword.successMessage}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <AuthInput
        label={dict.auth.forgotPassword.emailLabel}
        name="email"
        type="email"
        autoComplete="username"
        required
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
        {isPending
          ? dict.auth.forgotPassword.submitting
          : dict.auth.forgotPassword.submit}
      </Button>
    </form>
  );
}
