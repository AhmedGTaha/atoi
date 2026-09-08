"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/app/actions/authActions";
import { AuthInput } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getErrorMessage, isErrorCode } from "@/lib/i18n/errors";

const initialState: LoginState = {};

export function UniversalLoginForm({
  justSetPassword,
  locale,
}: {
  justSetPassword?: boolean;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  // Controlled so a failed attempt doesn't wipe the email the person just
  // typed — React resets uncontrolled fields once a form action settles.
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} className="space-y-4">
      {justSetPassword && (
        <p className="text-sm text-success">
          {dict.auth.signIn.passwordSetNotice}
        </p>
      )}
      <AuthInput
        label={dict.auth.signIn.emailLabel}
        name="email"
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthInput
        label={dict.auth.signIn.passwordLabel}
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {isErrorCode(state.error)
            ? getErrorMessage(locale, state.error)
            : state.error}
        </p>
      )}
      <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
        {isPending ? dict.auth.signIn.submitting : dict.auth.signIn.submit}
      </Button>
      <Link
        href="/forgot-password"
        className="block text-center text-sm text-accent hover:underline"
      >
        {dict.auth.signIn.forgotLink}
      </Link>
    </form>
  );
}
