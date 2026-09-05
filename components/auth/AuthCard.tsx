import Link from "next/link";
import { Logo } from "@/components/public/Logo";

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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-5 py-12">
      <Link href="/" className="mb-8">
        <Logo name={companyName} />
      </Link>
      <div className="w-full max-w-[420px] rounded-3xl bg-white p-7 shadow-sm sm:p-9">
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-ink/60">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-6 text-sm text-ink/60">{footer}</div>}
    </div>
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
        className="w-full rounded-2xl border border-black/10 bg-white px-3.5 py-3.5 outline-none placeholder:text-black/40 focus-visible:border-blue-dark"
      />
      {error && (
        <span role="alert" className="mt-1 block text-sm text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}
