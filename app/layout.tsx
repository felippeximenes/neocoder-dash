import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import ColorBends from "@/components/ColorBends";
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
        <div className="fixed inset-0 z-[-30] opacity-30">
          <ColorBends
            colors={["#7C3AED", "#A855F7", "#2EE6C8"]}
            rotation={90}
            speed={0.15}
            scale={1}
            frequency={1}
            warpStrength={1}
            mouseInfluence={0.6}
            noise={0.08}
            parallax={0.35}
            iterations={1}
            intensity={1.2}
            bandWidth={6}
            transparent
          />
        </div>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
