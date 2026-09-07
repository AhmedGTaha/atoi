import "server-only";
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import { cookies } from "next/headers";

const encoder = new TextEncoder();

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a long random string in your environment."
    );
  }
  return encoder.encode(secret);
}

export const ADMIN_SESSION_COOKIE = "atoi_admin_session";
export const CUSTOMER_SESSION_COOKIE = "atoi_customer_session";
export const TEAM_SESSION_COOKIE = "atoi_team_session";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface AdminSessionPayload {
  [key: string]: unknown;
  role: "admin";
  adminId: string;
  email: string;
  name: string;
}

export interface CustomerSessionPayload {
  [key: string]: unknown;
  role: "customer";
  customerId: string;
  email: string;
}

export interface TeamSessionPayload {
  [key: string]: unknown;
  role: "team";
  teamMemberId: string;
  email: string;
  name: string;
}

async function signSession(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

async function verifySession<T>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as T;
  } catch {
    return null;
  }
}

// Secure cookies are only sent by the browser over HTTPS. Vercel preview
// and production deployments are always HTTPS, but a local `next start`
// (production build) served over plain HTTP is not — checking NODE_ENV
// alone would silently break login there. APP_URL's scheme is the
// accurate signal for whichever environment this actually is.
const isHttpsDeployment = (process.env.APP_URL ?? "").startsWith("https://");

const cookieOptions = {
  httpOnly: true,
  secure: isHttpsDeployment,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};

export async function createAdminSession(payload: AdminSessionPayload) {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, cookieOptions);
}

export async function createCustomerSession(payload: CustomerSessionPayload) {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(CUSTOMER_SESSION_COOKIE, token, cookieOptions);
}

export async function createTeamSession(payload: TeamSessionPayload) {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(TEAM_SESSION_COOKIE, token, cookieOptions);
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession<AdminSessionPayload>(token);
}

export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  const store = await cookies();
  const token = store.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession<CustomerSessionPayload>(token);
}

export async function getTeamSession(): Promise<TeamSessionPayload | null> {
  const store = await cookies();
  const token = store.get(TEAM_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession<TeamSessionPayload>(token);
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}

export async function destroyCustomerSession() {
  const store = await cookies();
  store.delete(CUSTOMER_SESSION_COOKIE);
}

export async function destroyTeamSession() {
  const store = await cookies();
  store.delete(TEAM_SESSION_COOKIE);
}

/** Clears every role's session cookie regardless of which one is active. */
export async function destroyAllSessions() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  store.delete(CUSTOMER_SESSION_COOKIE);
  store.delete(TEAM_SESSION_COOKIE);
}

/** Edge-safe verification used by middleware (no `next/headers`). */
export async function verifyAdminToken(token: string) {
  return verifySession<AdminSessionPayload>(token);
}

export async function verifyCustomerToken(token: string) {
  return verifySession<CustomerSessionPayload>(token);
}

export async function verifyTeamToken(token: string) {
  return verifySession<TeamSessionPayload>(token);
}
