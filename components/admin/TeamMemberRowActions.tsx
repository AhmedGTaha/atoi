"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import type { AccountStatus } from "@prisma/client";
import {
  setTeamMemberActiveAction,
  resendTeamMemberInvitationAction,
  type ResendTeamInviteState,
} from "@/app/actions/teamActions";
import { PowerIcon, RefreshIcon } from "./icons";
import { RowActionMenu } from "./RowActionMenu";

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
      <RowActionMenu
        ariaLabel={`Actions for ${name}`}
        deleteLabel="Delete"
        onDelete={() => onRequestDelete(id, name)}
      />
    </div>
  );
}

function ToggleActiveButton({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const label = isActive ? "Deactivate" : "Activate";
  return (
    <form action={setTeamMemberActiveAction.bind(null, id, !isActive)}>
      <button
        type="submit"
        className="icon-action-btn"
        aria-label={label}
        title={label}
      >
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
      <SubmitIconButton
        label="Resend invitation"
        disabled={!applicable}
        icon={<RefreshIcon />}
      />
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
