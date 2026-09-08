import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function AuthCard({
  title,
  subtitle,
  companyName,
  locale,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  companyName: string;
  locale: Locale;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const brandName = companyName;
  const dict = getDictionary(locale);
  return (
    <main id="main-content" className="auth-layout">
      <div className="auth-context">
        <Link href="/" className="section-marker">
          {brandName} · {dict.auth.card.tagline}
        </Link>
        <div className="auth-wordmark">ATOI</div>
        <p className="max-w-sm text-muted">{dict.auth.card.portalTagline}</p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-accent-foreground hover:underline"
        >
          {dict.auth.card.backToWebsite}
        </Link>
      </div>
      <div>
        <Panel className="auth-panel">
          <div className="panel-strip auth-strip">
            <bdi dir="ltr">
              {brandName.toLowerCase()} / {dict.auth.card.accessLine}
            </bdi>
            <ThemeToggle locale={locale} />
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
          <span aria-hidden="true" className="ms-1 text-accent-foreground">
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
