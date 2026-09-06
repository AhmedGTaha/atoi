"use client";

import { useActionState } from "react";
import {
  convertRequestAction,
  type ConvertRequestState,
} from "@/app/actions/requestActions";
import { AdminInput, AdminTextarea } from "@/components/admin/ui";
import { Button } from "@/components/ui/Button";
import { GCC_COUNTRY_CODES, GCC_COUNTRIES } from "@/lib/validation/phone";
import type { ProjectRequest, TeamMember } from "@prisma/client";

const initialState: ConvertRequestState = {};

export function ConvertRequestForm({
  request,
  teamMembers,
}: {
  request: ProjectRequest;
  teamMembers: TeamMember[];
}) {
  const [state, formAction, isPending] = useActionState(
    convertRequestAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="requestId" value={request.id} />

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
        defaultValue={request.description}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput
          label="Contact name"
          name="customerName"
          defaultValue={request.name ?? ""}
        />
        <AdminInput
          label="Business name"
          name="businessName"
          defaultValue={request.businessName ?? ""}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AdminInput
          label="Email"
          name="email"
          type="email"
          required
          defaultValue={request.email}
        />
        <div>
          <span className="mb-1.5 block text-sm font-semibold">Phone</span>
          <div className="flex gap-2">
            <select
              name="phoneCountry"
              aria-label="Country code"
              defaultValue={request.phoneCountry}
              className="border border-rule bg-cream px-2.5 py-2.5"
            >
              {GCC_COUNTRY_CODES.map((code) => (
                <option key={code} value={code}>
                  {GCC_COUNTRIES[code].flag} {GCC_COUNTRIES[code].dialCode}
                </option>
              ))}
            </select>
            <input
              name="phoneNumber"
              aria-label="Phone number"
              type="tel"
              autoComplete="tel-national"
              defaultValue={request.phoneE164.replace(
                GCC_COUNTRIES[request.phoneCountry].dialCode,
                "",
              )}
              className="input"
            />
          </div>
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

      <Button type="submit" variant="primaryBlue" disabled={isPending}>
        {isPending ? "Creating…" : "Create Customer & Project"}
      </Button>
    </form>
  );
}
