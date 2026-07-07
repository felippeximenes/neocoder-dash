"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Palette, Megaphone, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/esteira", label: "Esteira de Conteúdo", icon: LayoutGrid },
  { href: "/design", label: "Design", icon: Palette },
  { href: "/clientes", label: "Projeto por Cliente", icon: Users },
  { href: "/smm", label: "SMM Social Media", icon: Megaphone },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-[#0D0D14]">
      <div className="flex h-16 items-center px-6">
        <span className="text-lg font-black tracking-tight text-text-primary">
          NEOCODER
        </span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Navegação principal">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary",
                isActive &&
                  "border-brand-blue bg-[#1A1A2E] text-text-primary"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
