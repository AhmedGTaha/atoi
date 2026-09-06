import clsx from "clsx";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const variants = {
  primaryDark: "btn-primary",
  primaryBlue: "btn-primary",
  outline: "btn-secondary",
  cream: "btn-cream",
  ghost: "btn-ghost",
  destructive: "btn-destructive",
};
type Variant = keyof typeof variants;

export function Button({ className, variant = "primaryBlue", ...props }: ComponentPropsWithoutRef<"button"> & { variant?: Variant }) {
  return <button className={clsx("btn disabled:pointer-events-none", variants[variant], className)} {...props} />;
}

export function LinkButton({ className, variant = "primaryBlue", href, ...props }: ComponentPropsWithoutRef<typeof Link> & { variant?: Variant }) {
  return <Link href={href} className={clsx("btn", variants[variant], className)} {...props} />;
}
