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
    <div className="flex items-baseline gap-2.5">
      <select
        id={countryId}
        value={country}
        onChange={(e) => onCountryChange(e.target.value as GccCountryCode)}
        className="dial-select shrink-0"
        aria-label="Country code"
      >
        {GCC_COUNTRY_CODES.map((code) => (
          <option key={code} value={code}>
            {GCC_COUNTRIES[code].dialCode} {GCC_COUNTRIES[code].label.toLowerCase()}
          </option>
        ))}
      </select>
      <input
        type="tel"
        aria-label={placeholder}
        inputMode="numeric"
        autoComplete="tel-national"
        value={number}
        onChange={(e) => onNumberChange(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder={placeholder}
        aria-describedby={describedById}
        aria-invalid={!!error}
        className="input min-w-0 flex-1"
      />
    </div>
  );
}
