"use client";

import { useActionState, useEffect, useId } from "react";
import { useFormStatus } from "react-dom";
import { deleteTeamMemberAction, type DeleteTeamMemberState } from "@/app/actions/teamActions";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const initialState: DeleteTeamMemberState = {};

/**
 * Rendered once at the table level (not per row) so its useActionState
 * effect can still fire after a successful delete — the row itself
 * unmounts the moment the member disappears from the revalidated list,
 * which would otherwise swallow the success toast.
 */
export function DeleteTeamMemberModal({
  target,
  onClose,
  onNotify,
}: {
  target: { id: string; name: string } | null;
  onClose: () => void;
  onNotify: (text: string, tone: "success" | "danger") => void;
}) {
  const [state, formAction] = useActionState(
    deleteTeamMemberAction.bind(null, target?.id ?? ""),
    initialState,
  );
  const titleId = useId();

  useEffect(() => {
    if (state.success && target) {
      onClose();
      onNotify(`${target.name} was deleted.`, "success");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <Modal isOpen={target !== null} onClose={onClose} titleId={titleId} className="max-w-md">
      <div className="panel-strip">
        <span className="text-danger">atoi / confirmation</span>
        <button
          className="icon-button"
          type="button"
          aria-label="Close confirmation"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="p-6">
        <h2 id={titleId} className="text-xl">
          Delete {target?.name}?
        </h2>
        <p className="mt-3 text-muted">
          This permanently removes {target?.name} from the team, unassigns them from any
          projects, and revokes their pending invitation. This cannot be undone.
        </p>
        <form action={formAction} className="mt-6 flex flex-wrap justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <DeleteSubmitButton />
        </form>
        {state.error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {state.error}
          </p>
        )}
      </div>
    </Modal>
  );
}

function DeleteSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
