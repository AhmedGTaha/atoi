"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  submitSupportRequestAction,
  type SupportFormState,
} from "@/app/actions/supportActions";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getErrorMessage, isErrorCode } from "@/lib/i18n/errors";

const initialState: SupportFormState = {};

export function SupportForm({
  projectId,
  locale,
}: {
  projectId: string;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const [state, formAction, isPending] = useActionState(
    submitSupportRequestAction.bind(null, projectId),
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="panel p-6">
      <h2 className="font-semibold">{dict.portal.needHelp}</h2>
      <form ref={formRef} action={formAction} className="mt-4 space-y-3">
        <textarea
          name="message"
          aria-label={dict.portal.needHelp}
          required
          minLength={5}
          maxLength={5000}
          rows={4}
          placeholder={dict.portal.supportPlaceholder}
          className="input"
        />
        {state.error && (
          <p role="alert" className="text-sm text-danger">
            {isErrorCode(state.error)
              ? getErrorMessage(locale, state.error)
              : state.error}
          </p>
        )}
        {state.success && (
          <p
            role="status"
            className={
              state.emailSent ? "text-sm text-success" : "text-sm text-warning"
            }
          >
            {state.emailSent
              ? dict.portal.supportSent
              : dict.portal.supportSentEmailFailed}
          </p>
        )}
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending
            ? dict.portal.sendingSupportRequest
            : dict.portal.sendSupportRequest}
        </Button>
      </form>
    </div>
  );
}
