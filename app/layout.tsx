import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Neocoder Dashboard",
  description: "Dashboard de gestão executiva Neocoder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <Sidebar />
        <main className="min-h-screen pl-60">
          <div className="mx-auto max-w-7xl px-8 py-10">{children}</div>
        </main>
      </body>
    </html>
  );
}
