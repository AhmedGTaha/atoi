import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

export function BlueprintMarks() {
  return (
    <>
      {["tl", "tr", "bl", "br"].map((corner) => (
        <i
          key={corner}
          aria-hidden="true"
          className={`blueprint-corner ${corner}`}
        />
      ))}
    </>
  );
}

export function BlueprintPanel({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={clsx("blueprint", className)} {...props}>
      <BlueprintMarks />
      {children}
    </div>
  );
}
