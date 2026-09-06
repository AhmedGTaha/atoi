import Link from "next/link";
import { BlueprintPanel } from "@/components/ui/BlueprintPanel";

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
  return (
    <main id="main-content" className="auth-layout">
      <div className="auth-context">
        <Link href="/" className="section-marker">{companyName} · Software studio</Link>
        <div className="auth-wordmark">ATOI</div>
        <p className="max-w-sm text-muted">Your projects. A clear view of the work.</p>
        <Link href="/" className="mt-8 inline-block text-sm text-blue-dark hover:underline">← Back to the website</Link>
      </div>
      <div>
        <BlueprintPanel className="auth-panel">
          <p className="section-marker mb-5">{companyName} / Account access</p>
          <h1>{title}</h1>
          {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </BlueprintPanel>
        {footer && <div className="mt-6 text-sm text-muted">{footer}</div>}
      </div>
    </main>
  );
}

export function AuthInput({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input
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
