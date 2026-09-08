"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Badge } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { Toast, type ToastMessage } from "@/components/ui/Toast";
import { RowActionMenu } from "./RowActionMenu";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { RequestNewProjectModal } from "./RequestNewProjectModal";
import { statusLabel } from "@/lib/i18n/labels";
import type { ProjectStatusValue } from "@/lib/validation/shared";
import type { TeamMember } from "@prisma/client";

export interface CustomerProjectRow {
  id: string;
  name: string;
  progress: number;
  status: ProjectStatusValue;
  phoneE164: string;
}

export function CustomerProjectsPanel({
  customerId,
  projects,
  teamMembers,
}: {
  customerId: string;
  projects: CustomerProjectRow[];
  teamMembers: TeamMember[];
}) {
  const [visibleProjects, setVisibleProjects] = useState(projects);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const nextToastId = useRef(0);

  const handleDeleted = useCallback((projectId: string) => {
    setVisibleProjects((current) => current.filter((p) => p.id !== projectId));
    setDeleteTarget(null);
    nextToastId.current += 1;
    setToast({ id: nextToastId.current, text: "Project was deleted.", tone: "success" });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Projects</h2>
        <Button type="button" variant="outline" onClick={() => setRequestOpen(true)}>
          Request new project
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {visibleProjects.length === 0 && (
          <p className="text-sm text-muted">No projects yet.</p>
        )}
        {visibleProjects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-3 border border-rule-soft p-4 hover:border-accent"
          >
            <Link href={`/admin/projects/${p.id}`} className="min-w-0 flex-1">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-muted">
                {p.progress}% complete · {p.phoneE164}
              </p>
            </Link>
            <div className="flex items-center gap-2">
              <Badge label={statusLabel("en", p.status)} tone={p.status} />
              <RowActionMenu
                ariaLabel={`Actions for project ${p.name}`}
                deleteLabel="Delete project"
                onDelete={() => setDeleteTarget(p.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <DeleteProjectModal
          key={deleteTarget}
          projectId={deleteTarget}
          customerId={customerId}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
      {requestOpen && (
        <RequestNewProjectModal
          customerId={customerId}
          teamMembers={teamMembers}
          onClose={() => setRequestOpen(false)}
        />
      )}
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
