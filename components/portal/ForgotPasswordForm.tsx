"use client";

import { useActionState } from "react";
import { forgotPasswordAction, type ForgotPasswordState } from "@/app/actions/customerAuthActions";
import { AuthInput } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";

const initialState: ForgotPasswordState = {};

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState);

  if (state.submitted) {
    return (
      <p className="text-ink/70">
        If an account exists for that email, we&apos;ve sent a link to reset your password.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <AuthInput label="Email" name="email" type="email" autoComplete="username" required />
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primaryBlue" className="w-full" disabled={isPending}>
        {isPending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
