import { randomBytes, createHash } from "crypto";

/**
 * Secure one-time tokens (customer invite / password reset).
 *
 * The raw token is only ever shown to the user once, inside a URL sent by
 * email. Only its SHA-256 hash is ever persisted (SecureToken.tokenHash),
 * so a database leak alone can never be used to impersonate a customer.
 */

export function generateRawToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export const INVITE_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
export const RESET_TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour
