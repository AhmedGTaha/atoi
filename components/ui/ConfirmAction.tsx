"use client";

import { useCallback, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { Modal } from "./Modal";
import { Button } from "./Button";

export function ConfirmAction({
  action,
  label,
  description,
}: {
  action: (formData: FormData) => void | Promise<void>;
  label: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const titleId = useId();
  return (
    <>
      <Button variant="destructive" type="button" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Modal
        isOpen={open}
        onClose={close}
        titleId={titleId}
        className="max-w-md"
      >
        <div className="panel-strip">
          <span className="text-danger">atoi / confirmation</span>
          <button
            className="icon-button"
            type="button"
            aria-label="Close confirmation"
            onClick={close}
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <h2 id={titleId} className="text-xl">
            {label}?
          </h2>
          <p className="mt-3 text-muted">{description}</p>
          <form
            action={action}
            className="mt-6 flex flex-wrap justify-end gap-3"
          >
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Submit label={label} />
          </form>
        </div>
      </Modal>
    </>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Deleting…" : label}
    </Button>
  );
}
