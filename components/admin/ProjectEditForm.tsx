"use client";

import { useActionState } from "react";
import {
  updateProjectAction,
  type ProjectFormState,
} from "@/app/actions/projectActions";
import { AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { PROJECT_STATUSES } from "@/lib/validation/shared";
import { statusLabel } from "@/lib/i18n/labels";
import type { Project, TeamMember } from "@prisma/client";

const initialState: ProjectFormState = {};

export function ProjectEditForm({
  project,
  teamMembers,
  currentMemberIds,
}: {
  project: Project;
  teamMembers: TeamMember[];
  currentMemberIds: string[];
}) {
  const [state, formAction, isPending] = useActionState(
    updateProjectAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={project.id} />

      <AdminInput
        label="Project name"
        name="name"
        required
        defaultValue={project.name}
      />
      <AdminTextarea
        label="Description"
        name="description"
        required
        rows={4}
        defaultValue={project.description}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminSelect label="Status" name="status" defaultValue={project.status}>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel("en", s)}
            </option>
          ))}
        </AdminSelect>
        <AdminInput
          label="Progress (%)"
          name="progress"
          type="number"
          min={0}
          max={100}
          defaultValue={project.progress}
        />
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-semibold">
          Assigned project members
        </span>
        {teamMembers.length === 0 ? (
          <p className="text-sm text-muted">No active team members.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {teamMembers.map((member) => (
              <label
                key={member.id}
                className="flex items-center gap-2 border border-rule px-3 py-2.5"
              >
                <input
                  type="checkbox"
                  name="memberIds"
                  value={member.id}
                  defaultChecked={currentMemberIds.includes(member.id)}
                />
                <span className="text-sm">
                  {member.name}
                  {!member.isActive && (
                    <span className="text-muted"> (inactive)</span>
                  )}
                </span>
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
      {state.success && (
        <p role="status" className="text-sm text-success">
          Saved.
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
