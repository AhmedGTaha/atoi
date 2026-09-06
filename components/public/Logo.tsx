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

  return <span className="brand">{name}</span>;
}
