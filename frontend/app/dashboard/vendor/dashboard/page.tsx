"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  Star,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  ShoppingBag,
  ExternalLink,
  Users,
} from "lucide-react";
import { PRODUCTS, Product } from "../../../shop/data/products";
import ShopNav from "../../../shop/components/ShopNav";
import { api } from "@/lib/api";

export default function VendorDashboardPage() {
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    let isMounted = true;
    api.products.getAll()
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setProductsList(res.data);
        }
      })
      .catch((err: unknown) => {
        console.warn("Using offline vendor products fallback:", (err as Error).message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const vendorProducts = productsList.slice(0, 3);

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <ShopNav cart={[]} onUpdateQuantity={() => {}} onRemoveItem={() => {}} />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 space-y-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/25">
                <div className="w-full h-full rounded-2xl bg-neutral-950 flex items-center justify-center text-white font-extrabold text-xl">
                  AS
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">AuraSonic Acoustics Lab</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">
                    Verified Flagship
                  </span>
                </div>
                <p className="text-xs text-neutral-400">Munich, Germany • Merchant ID #AS-9402</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/vendor/inventory"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition"
              >
                Manage Stock
              </Link>
              <Link
                href="/dashboard/vendor/products"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/30"
              >
                + New Product Drop
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Monthly Sales Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">$284,500.00</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% vs last month
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Orders Dispatched</span>
              <Truck className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">1,420</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> 99.8% on-time SLA
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Customer Rating</span>
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">4.9 / 5.0</div>
            <div className="text-[11px] text-neutral-400">Based on 3,240 verified buyers</div>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Active Catalog</span>
              <Package className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white">{PRODUCTS.length} SKUs</div>
            <div className="text-[11px] text-indigo-400 font-semibold">12,840 pulse followers</div>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h2 className="text-base font-bold text-white">Top Performing Products</h2>
            <Link
              href="/dashboard/vendor/products"
              className="text-xs text-indigo-400 hover:underline font-semibold"
            >
              View Full Catalog →
            </Link>
          </div>

          <div className="divide-y divide-neutral-800/80">
            {vendorProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover border border-neutral-800"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-white">{p.name}</h3>
                    <p className="text-[11px] text-neutral-400">{p.category} • {p.pulseScore} Pulse Score</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">${p.price}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">{p.stockCount} in stock</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-neutral-900 bg-neutral-950/80 py-8 px-4 text-xs text-neutral-500 mt-auto text-center">
        © 2026 ShopPulse Merchant Platform. All rights reserved.
      </footer>
    </div>
  );
}
