import clsx from "clsx";
import Link from "next/link";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-ink/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("rounded-2xl bg-white p-5 shadow-sm", className)}>{children}</div>;
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl bg-white p-8 text-center text-ink/50">{children}</p>;
}

const statusStyles: Record<string, string> = {
  PENDING_TEAM_APPROVAL: "bg-amber-100 text-amber-800",
  DEVELOPMENT: "bg-blue-100 text-blue-800",
  TESTING: "bg-purple-100 text-purple-800",
  DONE: "bg-green-100 text-green-800",
  NEW: "bg-amber-100 text-amber-800",
  CONVERTED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-gray-100 text-gray-600",
  INVITED: "bg-amber-100 text-amber-800",
  ACTIVE: "bg-green-100 text-green-800",
  DISABLED: "bg-gray-100 text-gray-600",
};

export function Badge({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        statusStyles[tone] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {label}
    </span>
  );
}

export function AdminInput({
  label,
  error,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input
        {...props}
        aria-invalid={!!error}
        className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 outline-none focus-visible:border-blue-dark"
      />
      {hint && !error && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1 block text-sm text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

export function AdminTextarea({
  label,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <textarea
        {...props}
        aria-invalid={!!error}
        className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 outline-none focus-visible:border-blue-dark"
      />
      {error && (
        <span role="alert" className="mt-1 block text-sm text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

export function AdminSelect({
  label,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <select
        {...props}
        aria-invalid={!!error}
        className="w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 outline-none focus-visible:border-blue-dark"
      >
        {children}
      </select>
      {error && (
        <span role="alert" className="mt-1 block text-sm text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

export function LinkButtonSmall({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-black/80"
    >
      {children}
    </Link>
  );
}
