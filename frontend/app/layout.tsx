import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopPulse | Next-Gen Performance Gear & Electronics",
  description:
    "Curated studio acoustics, mechanical desk essentials, and titanium biometric wearables backed by real-time delivery telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050811] text-slate-100 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
          <img
            src="/bg-circuit.png"
            alt="ShopPulse Digital Circuit Background"
            className="w-full h-full object-cover object-center fixed inset-0 opacity-45 mix-blend-screen scale-100 filter brightness-110 contrast-125"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#050811]/90 via-[#050811]/75 to-[#050811]/92" />

          <div className="absolute top-[20%] right-[10%] w-[650px] h-[650px] bg-cyan-500/12 rounded-full blur-[170px] animate-pulse-slow pointer-events-none" />
          <div className="absolute -top-[10%] left-[15%] w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-[180px] pointer-events-none" />
          <div className="absolute -bottom-[15%] right-[25%] w-[600px] h-[600px] bg-indigo-600/12 rounded-full blur-[170px] pointer-events-none" />

          <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
