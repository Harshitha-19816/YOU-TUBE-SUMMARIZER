import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aether OS [Desert]",
  description: "Desert Aether AI Workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${interTight.className} bg-obsidian text-slate-50 min-h-screen antialiased selection:bg-white/10 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
