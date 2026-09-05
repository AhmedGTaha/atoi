"use client";

import { useActionState } from "react";
import { resendInviteAction, type ResendInviteState } from "@/app/actions/customerActions";
import { Button } from "@/components/ui/Button";

const initialState: ResendInviteState = {};

export function ResendInviteButton({ customerId }: { customerId: string }) {
  const [state, formAction, isPending] = useActionState(resendInviteAction.bind(null, customerId), initialState);

  return (
    <form action={formAction}>
      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? "Sending…" : "Resend invitation email"}
      </Button>
      {state.sent && <p className="mt-2 text-sm text-green-700">Invitation email sent.</p>}
      {state.error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
