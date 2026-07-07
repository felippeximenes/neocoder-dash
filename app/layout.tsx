import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

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
    <html lang="pt-BR" className={`dark ${sora.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-transparent font-sans text-text-primary antialiased">
        <Topbar />
        <div className="flex">
          <Sidebar />
          <main className="min-h-screen flex-1 pl-60">
            <div className="mx-auto max-w-7xl px-8 py-10">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
