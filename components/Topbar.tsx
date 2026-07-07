import Image from "next/image";

export function Topbar() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex w-60 items-center justify-center">
        <Image src="/logo-neocoder.png" alt="Neocoder" width={234} height={73} className="h-9 w-auto" priority />
      </div>
      <div className="flex flex-1 items-center justify-end gap-2 px-8 text-sm font-medium text-text-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_8px_#2ee6c8]" />
        Dados em tempo real
      </div>
    </header>
  );
}
