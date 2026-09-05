"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitSupportRequestAction, type SupportFormState } from "@/app/actions/supportActions";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

const initialState: SupportFormState = {};

export function SupportForm({ projectId, locale }: { projectId: string; locale: Locale }) {
  const dict = getDictionary(locale);
  const [state, formAction, isPending] = useActionState(
    submitSupportRequestAction.bind(null, projectId),
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-bold">{dict.portal.needHelp}</h2>
      <form ref={formRef} action={formAction} className="mt-4 space-y-3">
        <textarea
          name="message"
          required
          minLength={5}
          maxLength={5000}
          rows={4}
          placeholder={dict.portal.supportPlaceholder}
          className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 outline-none focus-visible:border-blue-dark"
        />
        {state.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className={state.emailSent ? "text-sm text-green-700" : "text-sm text-amber-700"}>
            {state.emailSent ? dict.portal.supportSent : dict.portal.supportSentEmailFailed}
          </p>
        )}
        <Button type="submit" variant="primaryBlue" disabled={isPending}>
          {isPending ? dict.portal.sendingSupportRequest : dict.portal.sendSupportRequest}
        </Button>
      </form>
    </div>
  );
}
