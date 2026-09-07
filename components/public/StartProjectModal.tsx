"use client";

import { useEffect, useId, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { PhoneInput } from "./PhoneInput";
import { useStartProjectModal } from "./StartProjectModalContext";
import { submitProjectRequestAction } from "@/app/actions/projectRequestActions";
import { BUSINESS_TYPES } from "@/lib/validation/shared";
import {
  DEFAULT_GCC_COUNTRY,
  type GccCountryCode,
} from "@/lib/validation/phone";
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
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] =
    useState<GccCountryCode>(DEFAULT_GCC_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(true);
  const [reference, setReference] = useState("");

  function resetForm() {
    setBusinessType("");
    setName("");
    setBusinessName("");
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
    formData.set("businessName", businessName);
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
        setReference(result.reference);
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

  const contents = (
    <div className="inquiry-panel relative">
      <p className="panel-strip pe-16">
        <span aria-hidden="true" className="text-accent">
          ●
        </span>{" "}
        atoi ~ new-project.inquiry
        <button
          type="button"
          onClick={close}
          aria-label={dict.modal.close}
          className="icon-button absolute z-20 end-4 top-3"
        >
          <CloseIcon />
        </button>
      </p>

      {status === "success" ? (
        <ReceiptView
          dict={dict}
          confirmationEmailSent={confirmationEmailSent}
          reference={reference}
          email={email}
          onDone={close}
          titleId={titleId}
        />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-7">
          <p id={titleId} className="font-display text-sm text-muted">
            <span className="text-accent">$</span> atoi new-project
          </p>

          {/* Honeypot: hidden from real users, catches naive bots. */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor={`${titleId}-website`}>Website</label>
            <input
              id={`${titleId}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="terminal-row">
              <span className="terminal-label">{dict.modal.nameLabel}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dict.modal.namePlaceholder}
                className="input"
              />
            </label>
            <label className="terminal-row">
              <span className="terminal-label">{dict.modal.businessNameLabel}</span>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={dict.modal.businessNamePlaceholder}
                className="input"
              />
            </label>
            <label className="terminal-row">
              <span className="terminal-label">
                {dict.modal.emailLabel} <span className="text-accent">*</span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.modal.emailPlaceholder}
                required
                aria-invalid={!!fieldErrors.email}
                className="input"
              />
              {fieldErrors.email && (
                <span role="alert" className="text-sm text-danger">
                  {fieldErrors.email}
                </span>
              )}
            </label>
            <div className="terminal-row">
              <span className="terminal-label">
                {dict.modal.phoneLabel} <span className="text-accent">*</span>
              </span>
              <PhoneInput
                country={phoneCountry}
                onCountryChange={setPhoneCountry}
                number={phoneNumber}
                onNumberChange={setPhoneNumber}
                placeholder={dict.modal.phonePlaceholder}
                error={fieldErrors.phoneNumber}
              />
              {fieldErrors.phoneNumber && (
                <span role="alert" className="text-sm text-danger">
                  {fieldErrors.phoneNumber}
                </span>
              )}
            </div>
            <label className="terminal-row items-start">
              <span className="terminal-label pt-0.5">
                {dict.modal.descriptionLabel} <span className="text-accent">*</span>
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={dict.modal.descriptionPlaceholder}
                required
                minLength={10}
                maxLength={5000}
                rows={3}
                aria-invalid={!!fieldErrors.description}
                className="input resize-none"
              />
              {fieldErrors.description && (
                <span role="alert" className="text-sm text-danger">
                  {fieldErrors.description}
                </span>
              )}
            </label>
          </div>

          <div className="mt-5">
            <p className="mb-2 font-display text-sm text-faint">
              {dict.modal.businessTypeLabel}
            </p>
            <div className="columns-2 gap-6">
              {BUSINESS_TYPES.map((type) => (
                <label key={type} className="type-option">
                  <input
                    type="radio"
                    name="businessType"
                    checked={businessType === type}
                    onChange={() => setBusinessType(type)}
                  />
                  {dict.businessTypes[type]}
                </label>
              ))}
            </div>
          </div>

          {fieldErrors.form && (
            <p role="alert" className="mt-4 text-sm text-danger">
              {fieldErrors.form}
            </p>
          )}

          <div className="mt-6 flex justify-end border-t pt-5">
            <Button type="submit" variant="primary" disabled={status === "submitting"}>
              {status === "submitting" ? dict.modal.submitting : dict.modal.submit}
              <ArrowIcon />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      titleId={titleId}
      restoreFocusTo={triggerRef}
      className="max-w-[760px]"
    >
      {contents}
    </Modal>
  );
}

function ReceiptView({
  dict,
  confirmationEmailSent,
  reference,
  email,
  onDone,
  titleId,
}: {
  dict: ReturnType<typeof getDictionary>;
  confirmationEmailSent: boolean;
  reference: string;
  email: string;
  onDone: () => void;
  titleId: string;
}) {
  const lines = [
    "$ atoi send --inquiry",
    "> validating fields … ok",
    `> transmitting to ${email || "our team"} … ok`,
    `✓ received · ref ${reference}`,
  ];

  return (
    <div className="p-6 sm:p-7">
      <h2 id={titleId} className="sr-only">
        {dict.success.heading}
      </h2>
      <div className="font-display text-sm leading-loose text-muted">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <p className="mt-5 max-w-md text-muted">
        {confirmationEmailSent
          ? dict.success.bodyWithEmail
          : dict.success.bodyWithoutEmail}
      </p>
      <div className="mt-6 flex flex-wrap gap-3 border-t pt-5">
        <Button variant="primary" onClick={onDone}>
          {dict.success.done}
        </Button>
        <a href="mailto:info@atoi.online" className="btn btn-secondary">
          {dict.modal.emailUsInstead}
        </a>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1L15 15M15 1L1 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="ms-2 inline rtl:-scale-x-100"
    >
      <path
        d="M4 12h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
