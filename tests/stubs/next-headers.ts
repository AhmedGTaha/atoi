// `cookies()` requires an active request context (AsyncLocalStorage set up
// by the Next.js server). Outside of that — i.e. when session-layer
// functions are exercised directly in Vitest — it throws. This stub is a
// minimal in-memory stand-in exposing the same get/set/delete surface
// lib/auth/session.ts relies on, so integration tests can create and read
// real signed sessions without a running server.

interface StoredCookie {
  value: string;
}

const store = new Map<string, StoredCookie>();

function cookieStore() {
  return {
    get(name: string): StoredCookie | undefined {
      return store.get(name);
    },
    set(name: string, value: string, _options?: Record<string, unknown>): void {
      store.set(name, { value });
    },
    delete(name: string): void {
      store.delete(name);
    },
  };
}

export async function cookies() {
  return cookieStore();
}

export async function headers() {
  return new Headers();
}

/** Test-only: clears all stubbed cookies between test cases. */
export function __resetCookieStore(): void {
  store.clear();
}
