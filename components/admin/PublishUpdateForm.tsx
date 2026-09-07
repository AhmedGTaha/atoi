"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  publishUpdateAction,
  type PublishUpdateState,
} from "@/app/actions/projectActions";
import { AdminTextarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

const initialState: PublishUpdateState = {};

export function PublishUpdateForm({ projectId }: { projectId: string }) {
  const [state, formAction, isPending] = useActionState(
    publishUpdateAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      <AdminTextarea
        label="Project update"
        name="body"
        required
        rows={4}
        placeholder="What changed since the last update?"
      />

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          className={
            state.emailSent ? "text-sm text-success" : "text-sm text-warning"
          }
        >
          {state.emailSent
            ? "Update published and emailed to the customer."
            : "Update published, but the email failed to send. It's still visible in the portal."}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Publishing…" : "Publish update"}
      </Button>
    </form>
  );
}
