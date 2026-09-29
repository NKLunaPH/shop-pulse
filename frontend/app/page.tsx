import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Truck,
  ShoppingCart,
  CreditCard,
  Flame,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent text-neutral-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white overflow-hidden">

      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between relative z-10">
        <Link href="/shop/products" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              Shop<span className="text-indigo-400">Pulse</span>
            </span>
            <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-normal">
              Next-Gen Commerce
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/shop/products"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition flex items-center gap-1.5"
          >
            <span>Enter Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center space-y-8 relative z-10 my-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
          <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>ShopPulse 2.0 • Live Telemetry & Instant Checkout</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          The curated marketplace for{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-rose-300 bg-clip-text text-transparent">
            peak performance gear.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Ultra-low latency studio acoustics, mechanical workspace essentials, and biometric titanium wearables engineered with live dispatch tracking.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 text-left">
          <Link
            href="/shop/products"
            className="group p-5 rounded-2xl bg-neutral-900/50 hover:bg-neutral-900/90 border border-neutral-800 hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1 block"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition flex items-center justify-between">
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Browse top trending drops & pulse heat scores.
            </p>
          </Link>

          <Link
            href="/shop/cart"
            className="group p-5 rounded-2xl bg-neutral-900/50 hover:bg-neutral-900/90 border border-neutral-800 hover:border-violet-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1 block"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-3">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition flex items-center justify-between">
              <span>Shopping Cart</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Review items, apply promos & calculate shipping.
            </p>
          </Link>

          <Link
            href="/shop/checkout"
            className="group p-5 rounded-2xl bg-neutral-900/50 hover:bg-neutral-900/90 border border-neutral-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1 block"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition flex items-center justify-between">
              <span>Fast Checkout</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              1-touch Apple Pay, PayPal & 256-bit encrypted checkout.
            </p>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto pt-6 text-xs text-neutral-400">
          <div className="flex items-center justify-center gap-1.5">
            <Truck className="w-4 h-4 text-indigo-400" />
            <span>Free 2-Day Express</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>2-Year Warranty</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Live Dispatch Telemetry</span>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-neutral-900/80 bg-neutral-950/60 py-6 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>© 2026 ShopPulse Commerce Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-neutral-300 transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-300 transition">
              Terms
            </Link>
            <Link href="/support" className="hover:text-neutral-300 transition">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
