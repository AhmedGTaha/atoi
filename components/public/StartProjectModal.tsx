"use client";

import { useEffect, useId, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { PhoneInput } from "./PhoneInput";
import { useStartProjectModal } from "./StartProjectModalContext";
import { submitProjectRequestAction } from "@/app/actions/projectRequestActions";
import { BUSINESS_TYPES, DEFAULT_BUSINESS_TYPE } from "@/lib/validation/shared";
import {
  DEFAULT_GCC_COUNTRY,
  countryLabel,
  nationalNumberLength,
  type GccCountryCode,
} from "@/lib/validation/phone";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { businessTypeLabel } from "@/lib/i18n/labels";
import { getErrorMessage, isErrorCode } from "@/lib/i18n/errors";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "submitting" | "success" | "error";

export function StartProjectModal({ locale }: { locale: Locale }) {
  const { isOpen, close, triggerRef } = useStartProjectModal();
  const dict = getDictionary(locale);
  const titleId = useId();

  const [businessType, setBusinessType] = useState(DEFAULT_BUSINESS_TYPE);
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

  /** Resolves a field error, which the server sends as a semantic error
   * code, into locale-appropriate text. Falls back to the raw value for the
   * rare client-side (non-code) error string set in the catch block below. */
  function resolveError(
    code: string | undefined,
    params?: Record<string, string | number>,
  ): string | undefined {
    if (!code) return undefined;
    return isErrorCode(code) ? getErrorMessage(locale, code, params) : code;
  }

  function resetForm() {
    setBusinessType(DEFAULT_BUSINESS_TYPE);
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
      <div className="inquiry-strip">
        <span aria-hidden="true" className="text-accent-foreground">
          ●
        </span>{" "}
        <bdi dir="ltr" className="inquiry-title">
          {dict.modal.terminalStrip}
        </bdi>
        <button
          type="button"
          onClick={close}
          aria-label={dict.modal.close}
          className="icon-button inquiry-close-button"
        >
          <CloseIcon />
        </button>
      </div>

      {status === "success" ? (
        <ReceiptView
          dict={dict}
          confirmationEmailSent={confirmationEmailSent}
          reference={reference}
          onDone={close}
          titleId={titleId}
        />
      ) : (
        <form onSubmit={handleSubmit} noValidate className="inquiry-form">
          <p id={titleId} className="inquiry-preamble">
            <span className="text-accent-foreground">$</span>{" "}
            <bdi dir="ltr">{dict.modal.terminalPreamble}</bdi>
          </p>

          {/* Honeypot: hidden from real users, catches naive bots. Uses
              sr-only (clip, not offscreen positioning) so it can't create
              horizontal scroll overflow inside the modal. */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor={`${titleId}-website`}>
              {dict.modal.websiteHoneypotLabel}
            </label>
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

          <div className="inquiry-fields">
            <label className="terminal-row">
              <FieldPrompt>{dict.modal.nameLabel}</FieldPrompt>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dict.modal.namePlaceholder}
                maxLength={200}
                className="input"
              />
            </label>
            <label className="terminal-row">
              <FieldPrompt>{dict.modal.businessNameLabel}</FieldPrompt>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={dict.modal.businessNamePlaceholder}
                maxLength={200}
                className="input"
              />
            </label>
            <label className="terminal-row">
              <FieldPrompt required>{dict.modal.emailLabel}</FieldPrompt>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={dict.modal.emailPlaceholder}
                required
                maxLength={254}
                aria-invalid={!!fieldErrors.email}
                className="input"
              />
              {fieldErrors.email && (
                <span role="alert" className="text-sm text-danger">
                  {resolveError(fieldErrors.email)}
                </span>
              )}
            </label>
            <div className="terminal-row">
              <FieldPrompt required>{dict.modal.phoneLabel}</FieldPrompt>
              <PhoneInput
                country={phoneCountry}
                onCountryChange={(next) => {
                  setPhoneCountry(next);
                  const { max } = nationalNumberLength(next);
                  setPhoneNumber((current) => current.slice(0, max));
                }}
                number={phoneNumber}
                onNumberChange={setPhoneNumber}
                placeholder={dict.modal.phonePlaceholder}
                error={resolveError(fieldErrors.phoneNumber, {
                  country: countryLabel(locale, phoneCountry),
                  min: nationalNumberLength(phoneCountry).min,
                  max: nationalNumberLength(phoneCountry).max,
                })}
                locale={locale}
              />
              {fieldErrors.phoneNumber && (
                <span role="alert" className="text-sm text-danger">
                  {resolveError(fieldErrors.phoneNumber, {
                    country: countryLabel(locale, phoneCountry),
                    min: nationalNumberLength(phoneCountry).min,
                    max: nationalNumberLength(phoneCountry).max,
                  })}
                </span>
              )}
            </div>
            <label className="terminal-row">
              <FieldPrompt required>{dict.modal.descriptionLabel}</FieldPrompt>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={dict.modal.descriptionPlaceholder}
                required
                minLength={20}
                maxLength={5000}
                rows={4}
                aria-invalid={!!fieldErrors.description}
                className="input resize-none"
              />
              {fieldErrors.description && (
                <span role="alert" className="text-sm text-danger">
                  {resolveError(fieldErrors.description)}
                </span>
              )}
            </label>
          </div>

          <div className="inquiry-types">
            <p className="inquiry-types-label">
              {dict.modal.businessTypeLabel}
            </p>
            <div className="inquiry-type-grid">
              {BUSINESS_TYPES.map((type) => (
                <label key={type} className="type-option">
                  <input
                    type="radio"
                    name="businessType"
                    checked={businessType === type}
                    onChange={() => setBusinessType(type)}
                  />
                  {businessTypeLabel(locale, type)}
                </label>
              ))}
            </div>
          </div>

          {fieldErrors.form && (
            <p role="alert" className="mt-4 text-sm text-danger">
              {resolveError(fieldErrors.form)}
            </p>
          )}

          <div className="inquiry-submit-row">
            <Button
              type="submit"
              variant="primary"
              disabled={status === "submitting"}
            >
              {status === "submitting"
                ? dict.modal.submitting
                : dict.modal.submit}
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
      className="inquiry-dialog max-w-[760px]"
    >
      {contents}
    </Modal>
  );
}

function ReceiptView({
  dict,
  confirmationEmailSent,
  reference,
  onDone,
  titleId,
}: {
  dict: ReturnType<typeof getDictionary>;
  confirmationEmailSent: boolean;
  reference: string;
  onDone: () => void;
  titleId: string;
}) {
  const lines: React.ReactNode[] = [
    `$ ${dict.success.receiptCommand}`,
    `> ${dict.success.receiptValidating} ${dict.success.receiptStatusOk}`,
    <span key="transmitting">
      {"> "}
      {dict.success.receiptTransmitting} <bdi dir="ltr">info@atoi.online</bdi>{" "}
      {dict.success.receiptStatusOk}
    </span>,
    <span key="received">
      {"✓ "}
      {dict.success.receiptReceived} <bdi dir="ltr">{reference}</bdi>
    </span>,
    "",
    dict.success.replyLine1,
    dict.success.replyLine2,
  ];

  return (
    <div className="inquiry-receipt">
      <h2 id={titleId} className="sr-only">
        {dict.success.heading}
      </h2>
      <div className="font-display text-sm leading-loose text-muted">
        {lines.map((line, i) => (
          <div key={i}>{line || " "}</div>
        ))}
      </div>
      {!confirmationEmailSent && (
        <p className="mt-5 max-w-md text-muted">
          {dict.success.bodyWithoutEmail}
        </p>
      )}
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

/** Terminal-style field prompt: "label ›", or "label* ›" when required. */
function FieldPrompt({
  required,
  className,
  children,
}: {
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={className ? `terminal-label ${className}` : "terminal-label"}
    >
      {children}
      {required && <span className="text-accent-foreground">*</span>}
    </span>
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
      className="ms-2 inline flip-rtl"
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
