"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/app/actions/authActions";
import { AuthInput } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";

const initialState: LoginState = {};

export function UniversalLoginForm({ justSetPassword }: { justSetPassword?: boolean }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  // Controlled so a failed attempt doesn't wipe the email the person just
  // typed — React resets uncontrolled fields once a form action settles.
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} className="space-y-4">
      {justSetPassword && (
        <p className="text-sm text-success">
          Your password is set. Sign in to continue.
        </p>
      )}
      <AuthInput
        label="Email"
        name="email"
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthInput
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
      <Link
        href="/forgot-password"
        className="block text-center text-sm text-accent hover:underline"
      >
        Forgot your password?
      </Link>
    </form>
  );
}
