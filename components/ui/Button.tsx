import clsx from "clsx";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-[15px] leading-none transition-colors disabled:opacity-50 disabled:pointer-events-none min-h-11 px-6 py-3.5 whitespace-nowrap";

const variants = {
  primaryDark: "bg-ink text-white hover:bg-black/80",
  primaryBlue: "bg-blue-dark text-white hover:bg-blue-dark/90",
  outline: "border border-ink/20 text-ink hover:border-ink/40",
  cream: "bg-cream text-ink hover:bg-cream-dim",
  ghost: "text-ink hover:opacity-70",
};

type Variant = keyof typeof variants;

export function Button({
  className,
  variant = "primaryDark",
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: Variant }) {
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}

export function LinkButton({
  className,
  variant = "primaryDark",
  href,
  ...props
}: ComponentPropsWithoutRef<typeof Link> & { variant?: Variant }) {
  return <Link href={href} className={clsx(base, variants[variant], className)} {...props} />;
}
