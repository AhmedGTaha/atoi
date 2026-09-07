type IconProps = { className?: string };

const common = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function PowerIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M12 3v8" />
      <path d="M18.4 6.6a8 8 0 1 1-12.8 0" />
    </svg>
  );
}

export function RefreshIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M20 11a8 8 0 0 0-14.6-4.6M4 4v5h5" />
      <path d="M4 13a8 8 0 0 0 14.6 4.6M20 20v-5h-5" />
    </svg>
  );
}

export function EllipsisIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className}>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg {...common} className={className}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
