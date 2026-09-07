import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

export function Panel({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={clsx("panel", className)} {...props}>
      {children}
    </div>
  );
}
