"use client";

import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Sidebar } from "@/components/Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Topbar onMenuClick={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
      <div className="flex">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="min-h-screen w-full flex-1 lg:pl-60">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
        </main>
      </div>
    </>
  );
}
