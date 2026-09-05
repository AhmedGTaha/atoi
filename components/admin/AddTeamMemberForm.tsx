"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTeamMemberAction, type TeamFormState } from "@/app/actions/teamActions";
import { AdminInput } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";

const initialState: TeamFormState = {};

export function AddTeamMemberForm() {
  const [state, formAction, isPending] = useActionState(createTeamMemberAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="w-48">
        <AdminInput label="Name" name="name" required />
      </div>
      <div className="w-64">
        <AdminInput label="Email" name="email" type="email" required />
      </div>
      <Button type="submit" variant="primaryDark" disabled={isPending}>
        {isPending ? "Adding…" : "Add member"}
      </Button>
      {state.error && (
        <p role="alert" className="w-full text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
