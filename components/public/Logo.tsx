import Image from "next/image";

export function Logo({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={name}
        width={110}
        height={32}
        className="h-8 w-auto object-contain"
        priority
      />
    );
  }

  return (
    <span className="inline-flex items-center text-2xl font-extrabold tracking-tight text-ink">
      {name.toLowerCase()}
      <span className="ms-0.5 mb-2 inline-block h-2 w-2 self-start rounded-[2px] bg-ink" aria-hidden="true" />
    </span>
  );
}
