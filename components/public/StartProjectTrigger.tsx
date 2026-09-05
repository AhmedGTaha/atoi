"use client";

import clsx from "clsx";
import { useStartProjectModal } from "./StartProjectModalContext";

export function StartProjectTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useStartProjectModal();
  return (
    <button type="button" onClick={open} className={clsx(className)}>
      {children}
    </button>
  );
}
