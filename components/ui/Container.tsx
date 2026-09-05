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
    <As className={clsx("mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </As>
  );
}
