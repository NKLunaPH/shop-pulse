"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Search,
  Plus,
  Minus,
  RefreshCw,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import { PRODUCTS, Product } from "../../../shop/data/products";
import ShopNav from "../../../shop/components/ShopNav";

export default function VendorInventoryPage() {
  const [stockMap, setStockMap] = useState<Record<string, number>>(
    PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: p.stockCount }), {})
  );

  const [searchQuery, setSearchQuery] = useState("");

  const handleAdjustStock = (productId: string, delta: number) => {
    setStockMap((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta),
    }));
  };

  const filteredProducts = PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <ShopNav cart={[]} onUpdateQuantity={() => {}} onRemoveItem={() => {}} />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 space-y-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Warehouse className="w-6 h-6 text-indigo-400" />
              <span>Real-Time Warehouse Stock & Inventory Telemetry</span>
            </h1>
            <p className="text-xs text-neutral-400">
              Live stock levels sync instantly with the customer storefront.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/dashboard"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition"
          >
            ← Back to Vendor Dashboard
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product SKU or name..."
              className="w-full pl-9 pr-3.5 py-2 bg-neutral-900/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
            />
          </div>
          <span className="text-xs text-neutral-400">
            {filteredProducts.length} items in warehouse
          </span>
        </div>

        <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800 overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Product Details</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Stock Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredProducts.map((p) => {
                const count = stockMap[p.id] ?? p.stockCount;
                return (
                  <tr key={p.id} className="hover:bg-neutral-900/40 transition">
                    <td className="py-4 px-5 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-white text-sm truncate">{p.name}</div>
                        <div className="text-[11px] text-neutral-400">{p.tagline}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-white">${p.price}</td>
                    <td className="py-4 px-4 text-neutral-300">{p.category}</td>
                    <td className="py-4 px-4">
                      {count > 10 ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          In Stock
                        </span>
                      ) : count > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl p-1">
                        <button
                          onClick={() => handleAdjustStock(p.id, -5)}
                          className="p-1 text-neutral-400 hover:text-white rounded transition cursor-pointer"
                          title="Decrease 5"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-bold text-white select-none text-xs min-w-[30px] text-center">
                          {count}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(p.id, 5)}
                          className="p-1 text-neutral-400 hover:text-white rounded transition cursor-pointer"
                          title="Add 5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
