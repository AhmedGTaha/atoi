import clsx from "clsx";

export function Container({
  children,
  className,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <As className={clsx("site-container", className)}>
      {children}
    </As>
  );
}
