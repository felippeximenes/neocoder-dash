"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Palette, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/esteira", label: "Esteira de Conteúdo", icon: LayoutGrid },
  { href: "/design", label: "Design", icon: Palette },
  // Desativado por enquanto — reativar quando Esteira/SMM tiverem campo de Cliente confiável.
  // { href: "/clientes", label: "Projeto por Cliente", icon: Users },
  { href: "/smm", label: "SMM Social Media", icon: Megaphone },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 flex w-60 flex-col border-r border-border bg-[rgba(9,10,24,0.66)] p-3.5 backdrop-blur-md">
      <nav className="flex flex-col gap-1" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-text-secondary transition-all duration-300 hover:translate-x-1 hover:bg-brand-purple/10 hover:text-text-primary",
                isActive &&
                  "bg-gradient-to-r from-violet-700 to-violet-950 text-white shadow-[0_6px_20px_-8px_rgba(124,58,237,0.7)] hover:translate-x-0"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.75} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 px-1.5">
        <h4 className="font-display text-sm font-semibold text-brand-green">NEOCODER</h4>
        <p className="mt-2 text-xs leading-relaxed text-text-secondary">
          Indicadores em tempo real direto do Notion.
        </p>
        <div className="mt-3.5 h-[3px] w-[120px] rounded bg-gradient-to-r from-brand-purple to-transparent" />
      </div>
    </aside>
  );
}
