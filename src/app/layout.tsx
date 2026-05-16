import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Twinly — Plant Digital Twin",
  description:
    "Give your plant its own digital twin. Track health, check-ins, and AI insights over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
