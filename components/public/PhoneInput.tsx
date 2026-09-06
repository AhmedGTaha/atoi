"use client";

import { useId } from "react";
import {
  GCC_COUNTRIES,
  GCC_COUNTRY_CODES,
  type GccCountryCode,
} from "@/lib/validation/phone";

export function PhoneInput({
  country,
  onCountryChange,
  number,
  onNumberChange,
  placeholder,
  error,
  describedById,
}: {
  country: GccCountryCode;
  onCountryChange: (c: GccCountryCode) => void;
  number: string;
  onNumberChange: (v: string) => void;
  placeholder: string;
  error?: string;
  describedById?: string;
}) {
  const countryId = useId();
  return (
    <div
      className={`flex overflow-hidden  border bg-cream ${
        error ? "border-danger" : "border-rule"
      }`}
    >
      <select
        id={countryId}
        value={country}
        onChange={(e) => onCountryChange(e.target.value as GccCountryCode)}
        className="shrink-0 border-r border-rule bg-blue-light/40 px-2.5 text-sm font-medium text-ink"
        aria-label="Country code"
      >
        {GCC_COUNTRY_CODES.map((code) => (
          <option key={code} value={code}>
            {GCC_COUNTRIES[code].flag} {GCC_COUNTRIES[code].dialCode}
          </option>
        ))}
      </select>
      <input
        type="tel"
        aria-label={placeholder}
        inputMode="numeric"
        autoComplete="tel-national"
        value={number}
        onChange={(e) => onNumberChange(e.target.value)}
        placeholder={placeholder}
        aria-describedby={describedById}
        aria-invalid={!!error}
        className="w-full min-w-0 flex-1 px-3.5 py-3.5 placeholder:text-muted"
      />
    </div>
  );
}
