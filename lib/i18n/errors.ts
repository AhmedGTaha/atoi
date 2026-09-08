import type { Locale } from "./locale";
import { dictionaries } from "./dictionaries";
import { interpolate } from "./format";

export type ErrorCode = keyof (typeof dictionaries)["en"]["errors"];

/**
 * Resolves a semantic error code to locale-appropriate, presentation-ready
 * text. Business/validation logic stays locale-independent by only ever
 * producing a code (+ optional interpolation params); only this function,
 * called from the presentation layer, turns it into a sentence.
 */
export function getErrorMessage(
  locale: Locale,
  code: ErrorCode,
  params?: Record<string, string | number>,
): string {
  const template = dictionaries[locale].errors[code];
  return interpolate(template, params);
}

/** True if `value` is a known ErrorCode, for narrowing values from user input. */
export function isErrorCode(value: string): value is ErrorCode {
  return Object.prototype.hasOwnProperty.call(dictionaries.en.errors, value);
}
