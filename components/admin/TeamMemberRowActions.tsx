"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import type { AccountStatus } from "@prisma/client";
import {
  setTeamMemberActiveAction,
  resendTeamMemberInvitationAction,
  type ResendTeamInviteState,
} from "@/app/actions/teamActions";
import { PowerIcon, RefreshIcon, EllipsisIcon, TrashIcon } from "./icons";

export function TeamMemberRowActions({
  id,
  name,
  email,
  isActive,
  accountStatus,
  onNotify,
  onRequestDelete,
}: {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  accountStatus: AccountStatus;
  onNotify: (text: string, tone: "success" | "danger") => void;
  onRequestDelete: (id: string, name: string) => void;
}) {
  return (
    <div className="row-actions">
      <ToggleActiveButton id={id} isActive={isActive} />
      <ResendInviteButton
        id={id}
        email={email}
        applicable={accountStatus !== "ACTIVE"}
        onNotify={onNotify}
      />
      <OverflowMenu name={name} onDelete={() => onRequestDelete(id, name)} />
    </div>
  );
}

function ToggleActiveButton({ id, isActive }: { id: string; isActive: boolean }) {
  const label = isActive ? "Deactivate" : "Activate";
  return (
    <form action={setTeamMemberActiveAction.bind(null, id, !isActive)}>
      <button type="submit" className="icon-action-btn" aria-label={label} title={label}>
        <PowerIcon />
      </button>
    </form>
  );
}

const initialResendState: ResendTeamInviteState = {};

function ResendInviteButton({
  id,
  email,
  applicable,
  onNotify,
}: {
  id: string;
  email: string;
  applicable: boolean;
  onNotify: (text: string, tone: "success" | "danger") => void;
}) {
  const [state, formAction] = useActionState(
    resendTeamMemberInvitationAction.bind(null, id),
    initialResendState,
  );

  useEffect(() => {
    if (state.sent) onNotify(`Invitation email sent to ${email}.`, "success");
    if (state.error) onNotify(state.error, "danger");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction}>
      <SubmitIconButton label="Resend invitation" disabled={!applicable} icon={<RefreshIcon />} />
    </form>
  );
}

function SubmitIconButton({
  label,
  icon,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="icon-action-btn"
      aria-label={label}
      title={label}
      disabled={disabled || pending}
    >
      {icon}
    </button>
  );
}

function OverflowMenu({ name, onDelete }: { name: string; onDelete: () => void }) {
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const open = coords !== null;

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setCoords(null);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setCoords(null);
    }
    function handleViewportChange() {
      setCoords(null);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        className="icon-action-btn"
        aria-label="More actions"
        title="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          if (open) {
            setCoords(null);
            return;
          }
          const rect = triggerRef.current?.getBoundingClientRect();
          if (!rect) return;
          setCoords({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
        }}
      >
        <EllipsisIcon />
      </button>
      {coords &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={`Actions for ${name}`}
            className="row-menu"
            style={{ position: "fixed", top: coords.top, right: coords.right }}
          >
            <button
              type="button"
              role="menuitem"
              className="row-menu-item"
              onClick={() => {
                setCoords(null);
                onDelete();
              }}
            >
              <TrashIcon />
              Delete
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
