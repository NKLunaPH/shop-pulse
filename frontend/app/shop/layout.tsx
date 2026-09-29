import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ShopPulse | Next-Gen E-Commerce & Gear Marketplace",
  description:
    "Curated studio acoustics, mechanical desk essentials, and titanium biometric wearables backed by real-time delivery telemetry.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
