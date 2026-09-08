"use client";

import clsx from "clsx";
import { useStartProjectModal } from "./StartProjectModalContext";

export function StartProjectTrigger({
  className,
  children,
  ...buttonProps
}: {
  className?: string;
  children: React.ReactNode;
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick" | "type"
>) {
  const { open } = useStartProjectModal();
  return (
    <button
      {...buttonProps}
      type="button"
      onClick={open}
      className={clsx(className)}
    >
      {children}
    </button>
  );
}
