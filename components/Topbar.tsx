import Image from "next/image";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-8">
      <Image src="/logo-neocoder.png" alt="Neocoder" width={234} height={73} className="h-8 w-auto" priority />
      <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_8px_#2ee6c8]" />
        Dados em tempo real
      </div>
    </header>
  );
}
