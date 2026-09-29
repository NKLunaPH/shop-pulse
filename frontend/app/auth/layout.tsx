import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ShopPulse Authentication | Secure Access & Registration",
  description:
    "Log in or create your ShopPulse account to experience next-generation e-commerce, instant checkout, and real-time order pulse.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-transparent text-neutral-100 flex flex-col justify-center selection:bg-indigo-500 selection:text-white">
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
