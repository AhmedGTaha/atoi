"use client";

import { useActionState, useState } from "react";
import { loginCustomerAction, type CustomerLoginState } from "@/app/actions/customerAuthActions";
import { AuthInput } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const initialState: CustomerLoginState = {};

export function CustomerLoginForm({ justSetPassword }: { justSetPassword: boolean }) {
  const [state, formAction, isPending] = useActionState(loginCustomerAction, initialState);
  // Controlled so a failed attempt doesn't wipe the email the person just
  // typed — React resets uncontrolled fields once a form action settles.
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} className="space-y-4">
      {justSetPassword && (
        <p className="bg-cream-dim px-3.5 py-2.5 text-sm text-success">
          Your password has been set. You can sign in now.
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
      <AuthInput label="Password" name="password" type="password" autoComplete="current-password" required />
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primaryBlue" className="w-full" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm">
        <Link href="/forgot-password" className="font-semibold text-blue-dark hover:underline">
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}
