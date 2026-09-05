// Next's cache primitives require an active request/build context
// (AsyncLocalStorage stores set up by the Next.js server). Outside of that
// — i.e. when service-layer functions are exercised directly in Vitest —
// they throw "Invariant: ... missing" errors. This stub makes them inert
// pass-throughs so integration tests can call the same service functions
// the app uses, without spinning up a full Next.js server.

export function unstable_cache<Args extends unknown[], Return>(
  fn: (...args: Args) => Promise<Return>
): (...args: Args) => Promise<Return> {
  return fn;
}

export function revalidateTag(_tag: string): void {}
export function revalidatePath(_path: string, _type?: "layout" | "page"): void {}
