"use client";

import { useActionState, useState } from "react";
import { loginAdminAction, type AdminLoginState } from "@/app/actions/adminAuthActions";
import { AuthInput } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";

const initialState: AdminLoginState = {};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, initialState);
  // Controlled so a failed attempt doesn't wipe the email the person just
  // typed — React resets uncontrolled fields once a form action settles.
  const [email, setEmail] = useState("");

  return (
    <form action={formAction} className="space-y-4">
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
      <Button type="submit" variant="primaryDark" className="w-full" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
