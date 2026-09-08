"use client";

import { useActionState, useEffect, useId } from "react";
import { useFormStatus } from "react-dom";
import {
  deleteProjectAction,
  type DeleteProjectState,
} from "@/app/actions/projectActions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const initialState: DeleteProjectState = {};

export function DeleteProjectModal({
  projectId,
  customerId,
  onClose,
  onDeleted,
}: {
  projectId: string;
  customerId: string;
  onClose: () => void;
  onDeleted: (projectId: string) => void;
}) {
  const [state, formAction] = useActionState(
    deleteProjectAction.bind(null, projectId, customerId),
    initialState,
  );
  const titleId = useId();

  useEffect(() => {
    if (state.success) onDeleted(projectId);
  }, [onDeleted, projectId, state.success]);

  return (
    <Modal isOpen onClose={onClose} titleId={titleId} className="max-w-md">
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
          Delete project?
        </h2>
        <p className="mt-3 text-muted">
          This will permanently delete this project, its updates and support
          requests. This action cannot be undone.
        </p>
        <form
          action={formAction}
          className="mt-6 flex flex-wrap justify-end gap-3"
        >
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
      {pending ? "Deleting…" : "Delete project"}
    </Button>
  );
}
