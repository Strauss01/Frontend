import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

/* ─────────────────────────────────────────────
   FONTS — variable names must match tailwind.config.ts
   fontFamily keys: --font-playfair, --font-dm-sans, --font-ibm-mono
───────────────────────────────────────────── */

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",   // ← was "--font-serif", didn't match config
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",    // ← was "--font-sans", didn't match config
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-mono",   // ← was "--font-mono", didn't match config
  display: "swap",
});

/* ─────────────────────────────────────────────
   METADATA
───────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Statura — Legal Intelligence",
  description: "AI-powered legal document analysis platform",
};

/* ─────────────────────────────────────────────
   ROOT LAYOUT
───────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${ibmMono.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}