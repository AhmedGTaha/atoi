import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Panel } from "@/components/ui/Panel";

export function AuthCard({
  title,
  subtitle,
  companyName,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  companyName: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const brandName = companyName;
  return (
    <main id="main-content" className="auth-layout">
      <div className="auth-context">
        <Link href="/" className="section-marker">
          {brandName} · Software studio
        </Link>
        <div className="auth-wordmark">ATOI</div>
        <p className="max-w-sm text-muted">
          Your projects. A clear view of the work.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-accent hover:underline"
        >
          ← Back to the website
        </Link>
      </div>
      <div>
        <Panel className="auth-panel">
          <div className="panel-strip auth-strip">
            <span>{brandName.toLowerCase()} / account access</span>
            <ThemeToggle />
          </div>
          <h1>{title}</h1>
          {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </Panel>
        {footer && <div className="mt-6 text-sm text-muted">{footer}</div>}
      </div>
    </main>
  );
}

export function AuthInput({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  const feedbackId =
    props.id || props.name ? `${props.id ?? props.name}-feedback` : undefined;
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">
        {label}
        {props.required && (
          <span aria-hidden="true" className="ms-1 text-accent">
            *
          </span>
        )}
      </span>
      <input
        {...props}
        aria-invalid={!!error}
        aria-describedby={error ? feedbackId : props["aria-describedby"]}
        className="input"
      />
      {error && (
        <span
          id={feedbackId}
          role="alert"
          className="mt-1 block text-sm text-danger"
        >
          {error}
        </span>
      )}
    </label>
  );
}
