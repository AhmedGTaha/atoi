import clsx from "clsx";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const variants = {
  primary: "btn-primary",
  outline: "btn-secondary",

  ghost: "btn-ghost",
  destructive: "btn-destructive",
};
type Variant = keyof typeof variants;

export function Button({
  className,
  variant = "primary",
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: Variant }) {
  return (
    <button
      className={clsx(
        "btn disabled:pointer-events-none",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function LinkButton({
  className,
  variant = "primary",
  href,
  ...props
}: ComponentPropsWithoutRef<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      href={href}
      className={clsx("btn", variants[variant], className)}
      {...props}
    />
  );
}
