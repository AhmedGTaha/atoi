"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Card, EmptyState } from "@/components/admin/ui";
import { Toast, type ToastMessage } from "@/components/ui/Toast";
import { DeleteRequestModal } from "./DeleteRequestModal";
import { RowActionMenu } from "./RowActionMenu";

export interface RequestTableRow {
  id: string;
  contact: string;
  email: string;
  businessType: string;
  description: string;
  submitted: string;
  state: string;
}

export function RequestsTable({ requests }: { requests: RequestTableRow[] }) {
  const [visibleRequests, setVisibleRequests] = useState(requests);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const nextToastId = useRef(0);

  useEffect(() => setVisibleRequests(requests), [requests]);

  const handleDeleted = useCallback((requestId: string) => {
    setVisibleRequests((current) =>
      current.filter((request) => request.id !== requestId),
    );
    setDeleteTarget(null);
    nextToastId.current += 1;
    setToast({
      id: nextToastId.current,
      text: "Request was deleted.",
      tone: "success",
    });
  }, []);

  if (visibleRequests.length === 0) {
    return (
      <>
        <EmptyState>No project requests yet.</EmptyState>
        {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
      </>
    );
  }

  return (
    <>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-rule text-start text-muted">
              <th className="px-5 py-3 text-start font-medium">Contact</th>
              <th className="px-5 py-3 text-start font-medium">
                Business type
              </th>
              <th className="px-5 py-3 text-start font-medium">Description</th>
              <th className="px-5 py-3 text-start font-medium">Submitted</th>
              <th className="px-5 py-3 text-start font-medium">Status</th>
              <th className="w-14 px-3 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRequests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-rule-soft last:border-0 hover:bg-surface"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/requests/${request.id}`}
                    className="font-semibold hover:underline"
                  >
                    {request.contact}
                  </Link>
                  <p className="text-xs text-muted">{request.email}</p>
                </td>
                <td className="px-5 py-3 text-foreground/70">
                  {request.businessType}
                </td>
                <td className="max-w-xs px-5 py-3 text-foreground/70">
                  <span className="line-clamp-1">{request.description}</span>
                </td>
                <td className="px-5 py-3 text-muted">{request.submitted}</td>
                <td className="px-5 py-3">
                  <Badge label={request.state} tone={request.state} />
                </td>
                <td className="w-14 px-3 py-3 text-end">
                  <div className="row-actions">
                    <RowActionMenu
                      ariaLabel={`Actions for request from ${request.contact}`}
                      deleteLabel="Delete request"
                      onDelete={() => setDeleteTarget(request.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {deleteTarget && (
        <DeleteRequestModal
          key={deleteTarget}
          requestId={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={handleDeleted}
        />
      )}
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
    </>
  );
}
