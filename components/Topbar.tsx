"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
  menuOpen: boolean;
}

export function Topbar({ onMenuClick, menuOpen }: TopbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex items-center gap-2 px-4 lg:w-60 lg:justify-center lg:px-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-brand-purple/10 hover:text-text-primary lg:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Image src="/logo-neocoder.png" alt="Neocoder" width={234} height={73} className="h-8 w-auto lg:h-9" priority />
      </div>
      <div className="flex flex-1 items-center justify-end gap-2 px-4 text-sm font-medium text-text-secondary sm:px-8">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_8px_#2ee6c8]" />
        <span className="hidden sm:inline">Dados em tempo real</span>
      </div>
    </header>
  );
}
