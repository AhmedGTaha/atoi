"use client";

import { useCallback, useRef, useState } from "react";
import type { AccountStatus } from "@prisma/client";
import { Badge } from "@/components/admin/ui";
import { Toast, type ToastMessage } from "@/components/ui/Toast";
import { TeamMemberRowActions } from "./TeamMemberRowActions";
import { DeleteTeamMemberModal } from "./DeleteTeamMemberModal";

export interface TeamMemberRow {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  accountStatus: AccountStatus;
  _count: { projects: number };
}

export function TeamMembersTable({ members }: { members: TeamMemberRow[] }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const nextToastId = useRef(0);

  const notify = useCallback((text: string, tone: "success" | "danger") => {
    nextToastId.current += 1;
    setToast({ id: nextToastId.current, text, tone });
  }, []);

  return (
    <>
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-rule text-muted">
            <th className="px-5 py-3 text-start font-medium">Name</th>
            <th className="px-5 py-3 text-start font-medium">Email</th>
            <th className="px-5 py-3 text-start font-medium">Projects</th>
            <th className="px-5 py-3 text-start font-medium">Status</th>
            <th className="px-5 py-3 text-start font-medium">Account</th>
            <th className="px-5 py-3 text-start font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-b border-rule-soft last:border-0">
              <td className="px-5 py-3 font-semibold">{m.name}</td>
              <td className="px-5 py-3 text-foreground/70">{m.email}</td>
              <td className="px-5 py-3 text-foreground/70">{m._count.projects}</td>
              <td className="px-5 py-3">
                <Badge
                  label={m.isActive ? "Active" : "Inactive"}
                  tone={m.isActive ? "ACTIVE" : "DISABLED"}
                />
              </td>
              <td className="px-5 py-3">
                <Badge
                  label={
                    m.accountStatus === "ACTIVE"
                      ? "Active"
                      : m.accountStatus === "INVITED"
                        ? "Invited"
                        : "Disabled"
                  }
                  tone={m.accountStatus}
                />
              </td>
              <td className="px-5 py-3 text-end">
                <TeamMemberRowActions
                  id={m.id}
                  name={m.name}
                  email={m.email}
                  isActive={m.isActive}
                  accountStatus={m.accountStatus}
                  onNotify={notify}
                  onRequestDelete={(id, name) => setDeleteTarget({ id, name })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DeleteTeamMemberModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onNotify={notify}
      />
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
    </>
  );
}
