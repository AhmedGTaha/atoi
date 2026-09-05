"use client";

import { useEffect, useId, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { PhoneInput } from "./PhoneInput";
import { useStartProjectModal } from "./StartProjectModalContext";
import { submitProjectRequestAction } from "@/app/actions/projectRequestActions";
import { BUSINESS_TYPES } from "@/lib/validation/shared";
import { DEFAULT_GCC_COUNTRY, type GccCountryCode } from "@/lib/validation/phone";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

export function StartProjectModal({ locale }: { locale: Locale }) {
  const { isOpen, close, triggerRef } = useStartProjectModal();
  const dict = getDictionary(locale);
  const titleId = useId();

  const [businessType, setBusinessType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState<GccCountryCode>(DEFAULT_GCC_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(true);

  function resetForm() {
    setBusinessType("");
    setName("");
    setDescription("");
    setEmail("");
    setPhoneCountry(DEFAULT_GCC_COUNTRY);
    setPhoneNumber("");
    setWebsite("");
    setStatus("idle");
    setFieldErrors({});
  }

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(resetForm, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setFieldErrors({});

    const formData = new FormData();
    formData.set("businessType", businessType);
    formData.set("name", name);
    formData.set("description", description);
    formData.set("email", email);
    formData.set("phoneCountry", phoneCountry);
    formData.set("phoneNumber", phoneNumber);
    formData.set("preferredLocale", locale);
    formData.set("website", website);

    try {
      const result = await submitProjectRequestAction(formData);
      if (result.ok) {
        setConfirmationEmailSent(result.confirmationEmailSent);
        setStatus("success");
      } else if ("blocked" in result) {
        // Pretend success to bots without persisting/emailing anything.
        setStatus("success");
      } else {
        setFieldErrors(result.fieldErrors);
        setStatus("error");
      }
    } catch {
      setFieldErrors({ form: dict.modal.genericError });
      setStatus("error");
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={close} titleId={titleId} restoreFocusTo={triggerRef} className="max-w-[560px]">
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={close}
          aria-label={dict.modal.close}
          className="absolute end-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white hover:bg-black/80"
        >
          <CloseIcon />
        </button>

        {status === "success" ? (
          <SuccessView
            dict={dict}
            confirmationEmailSent={confirmationEmailSent}
            onDone={close}
            titleId={titleId}
          />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <p className="text-sm font-semibold text-blue-dark">{dict.modal.eyebrow}</p>
            <h2 id={titleId} className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {dict.modal.heading}
            </h2>
            <p className="mt-2 text-black/60">{dict.modal.subheading}</p>

            {/* Honeypot: hidden from real users, catches naive bots. */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={dict.modal.businessTypeLabel}>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full rounded-2xl border border-black/10 bg-white px-3.5 py-3.5 outline-none"
                >
                  <option value="">{dict.modal.businessTypePlaceholder}</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {dict.businessTypes[type]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={dict.modal.nameLabel}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={dict.modal.namePlaceholder}
                  className="w-full rounded-2xl border border-black/10 bg-white px-3.5 py-3.5 outline-none placeholder:text-black/40"
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label={dict.modal.descriptionLabel} required error={fieldErrors.description}>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={dict.modal.descriptionPlaceholder}
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={4}
                  aria-invalid={!!fieldErrors.description}
                  className="w-full resize-none rounded-2xl border border-black/10 bg-white px-3.5 py-3.5 outline-none placeholder:text-black/40"
                />
              </Field>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={dict.modal.emailLabel} required error={fieldErrors.email}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={dict.modal.emailPlaceholder}
                  required
                  aria-invalid={!!fieldErrors.email}
                  className="w-full rounded-2xl border border-black/10 bg-white px-3.5 py-3.5 outline-none placeholder:text-black/40"
                />
              </Field>

              <Field label={dict.modal.phoneLabel} required error={fieldErrors.phoneNumber}>
                <PhoneInput
                  country={phoneCountry}
                  onCountryChange={setPhoneCountry}
                  number={phoneNumber}
                  onNumberChange={setPhoneNumber}
                  placeholder={dict.modal.phonePlaceholder}
                  error={fieldErrors.phoneNumber}
                />
              </Field>
            </div>

            {fieldErrors.form && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {fieldErrors.form}
              </p>
            )}

            <Button
              type="submit"
              variant="primaryBlue"
              disabled={status === "submitting"}
              className="mt-6 w-full"
            >
              {status === "submitting" ? dict.modal.submitting : dict.modal.submit}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">
        {label} {required && <span className="text-blue-dark">*</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1 block text-sm text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

function SuccessView({
  dict,
  confirmationEmailSent,
  onDone,
  titleId,
}: {
  dict: ReturnType<typeof getDictionary>;
  confirmationEmailSent: boolean;
  onDone: () => void;
  titleId: string;
}) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-light">
        <CheckIcon />
      </div>
      <h2 id={titleId} className="mt-6 text-3xl font-extrabold tracking-tight">
        {dict.success.heading}
      </h2>
      <p className="mt-3 max-w-sm text-black/70">
        {confirmationEmailSent ? dict.success.bodyWithEmail : dict.success.bodyWithoutEmail}
      </p>
      <Button variant="primaryBlue" onClick={onDone} className="mt-8">
        {dict.success.done}
      </Button>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13L10 18L19 7" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
