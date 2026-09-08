"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import {
  createProjectForCustomerAction,
  type CreateProjectState,
} from "@/app/actions/projectActions";
import { AdminInput, AdminTextarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { GCC_COUNTRY_CODES, GCC_COUNTRIES, dialCodeFor } from "@/lib/validation/phone";
import type { TeamMember } from "@prisma/client";

const initialState: CreateProjectState = {};

export function RequestNewProjectModal({
  customerId,
  teamMembers,
  onClose,
}: {
  customerId: string;
  teamMembers: TeamMember[];
  onClose: () => void;
}) {
  const [state, formAction] = useActionState(
    createProjectForCustomerAction,
    initialState,
  );
  const titleId = useId();

  return (
    <Modal isOpen onClose={onClose} titleId={titleId} className="max-w-lg">
      <div className="panel-strip">
        <span>atoi / new project</span>
        <button
          className="icon-button"
          type="button"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="p-6">
        <h2 id={titleId} className="text-xl">
          Request new project
        </h2>
        <p className="mt-2 text-muted">
          Creates another project for this customer. Its phone number is
          recorded on this project only — the customer&apos;s own contact
          phone stays unchanged.
        </p>

        <form action={formAction} className="mt-5 space-y-4">
          <input type="hidden" name="customerId" value={customerId} />

          <AdminInput
            label="Project name"
            name="projectName"
            required
            placeholder="e.g. Marsa Retail Website"
          />

          <AdminTextarea
            label="Description"
            name="description"
            required
            rows={4}
          />

          <div>
            <span className="mb-1.5 block text-sm font-semibold">
              Project phone
            </span>
            <div className="flex gap-2">
              <select
                name="phoneCountry"
                aria-label="Country code"
                defaultValue="BH"
                className="border border-rule bg-canvas px-2.5 py-2.5"
              >
                {GCC_COUNTRY_CODES.map((code) => (
                  <option key={code} value={code}>
                    {GCC_COUNTRIES[code].flag} {dialCodeFor(code)}
                  </option>
                ))}
              </select>
              <input
                name="phoneNumber"
                aria-label="Phone number"
                type="tel"
                autoComplete="tel-national"
                className="input"
              />
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-semibold">
              Assigned project members
            </span>
            {teamMembers.length === 0 ? (
              <p className="text-sm text-muted">
                No active team members yet. Add one under Team first.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {teamMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-2 border border-rule px-3 py-2.5"
                  >
                    <input type="checkbox" name="memberIds" value={member.id} />
                    <span className="text-sm">{member.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {state.error && (
            <p role="alert" className="text-sm text-danger">
              {state.error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </Modal>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" disabled={pending}>
      {pending ? "Creating…" : "Create project"}
    </Button>
  );
}
