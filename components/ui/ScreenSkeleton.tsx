export function ScreenSkeleton() {
  return <div role="status" className="p-6 sm:p-10 space-y-8" aria-label="Loading">
    <span className="sr-only">Loading…</span>
    <div className="border-b pb-8 space-y-3" aria-hidden="true"><div className="skeleton w-24" /><div className="skeleton h-12 w-2/3" /></div>
    <div className="grid gap-6 sm:grid-cols-2" aria-hidden="true">{[0,1].map(n => <div key={n} className="panel p-6 space-y-6"><div className="skeleton w-1/2" />{[0,1,2,3].map(row => <div key={row} className="skeleton w-full" />)}</div>)}</div>
  </div>;
}
