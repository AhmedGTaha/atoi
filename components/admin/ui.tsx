import clsx from "clsx";
import Link from "next/link";
import { BlueprintPanel } from "@/components/ui/BlueprintPanel";

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
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  const isTable = className?.includes("overflow-x-auto");
  return <BlueprintPanel className={clsx(!isTable && "p-5", className?.replace("overflow-x-auto", ""))}>
    {isTable ? <><p className="table-hint">Scroll horizontally to view all columns →</p><div className="table-scroll" role="region" aria-label="Data table" tabIndex={0}>{children}</div></> : children}
  </BlueprintPanel>;
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="empty-state">{children}</p>;
}

export function Badge({ label, tone }: { label: string; tone: string }) {
  return <span className={clsx("status", ["DONE", "ACTIVE", "CONVERTED"].includes(tone) && "status-complete", ["ARCHIVED", "DISABLED"].includes(tone) && "status-muted")}>{label}</span>;
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
        className="input"
      />
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1 block text-sm text-danger">
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
        className="input"
      />
      {error && (
        <span role="alert" className="mt-1 block text-sm text-danger">
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
        className="input"
      >
        {children}
      </select>
      {error && (
        <span role="alert" className="mt-1 block text-sm text-danger">
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
      className="btn btn-primary"
    >
      {children}
    </Link>
  );
}
