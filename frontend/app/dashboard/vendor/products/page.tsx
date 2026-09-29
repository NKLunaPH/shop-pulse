"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Search,
  UploadCloud,
} from "lucide-react";
import { PRODUCTS, Product } from "../../../shop/data/products";
import ShopNav from "../../../shop/components/ShopNav";
import { api } from "@/lib/api";

export default function VendorProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState<Product["category"]>("Audio");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductTagline, setNewProductTagline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.products.getAll()
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setProductsList(res.data);
        }
      })
      .catch((err: unknown) => {
        console.warn("Backend products fetch fallback:", (err as Error).message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    const newProduct: Product = {
      id: `custom-prod-${Date.now()}`,
      name: newProductName,
      tagline: newProductTagline || "Precision engineered ShopPulse hardware drop.",
      category: newProductCategory,
      price: parseFloat(newProductPrice),
      originalPrice: parseFloat(newProductPrice) * 1.25,
      rating: 5.0,
      reviewsCount: 1,
      badge: "New",
      pulseScore: 99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      ],
      description: "Next-generation hardware release created via vendor studio portal.",
      features: ["Custom acoustic/mechanical tuning", "Official ShopPulse 2-Year Warranty"],
      specs: { Release: "Fall 2026", Origin: "Munich Engineering" },
      colors: [{ name: "Obsidian Black", hex: "#171717" }],
      inStock: true,
      stockCount: 50,
    };

    setIsSubmitting(true);
    try {
      await api.products.create(newProduct);
    } catch (err: unknown) {
      console.warn("Backend create product fallback:", (err as Error).message);
    } finally {
      setIsSubmitting(false);
      setProductsList([newProduct, ...productsList]);
      setIsAddingProduct(false);
      setNewProductName("");
      setNewProductPrice("");
      setNewProductTagline("");
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <ShopNav cart={[]} onUpdateQuantity={() => {}} onRemoveItem={() => {}} />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 space-y-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-indigo-400" />
              <span>Catalog & Product Release Manager</span>
            </h1>
            <p className="text-xs text-neutral-400">
              Publish new hardware drops, set Pulse pricing, and manage feature specs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/vendor/dashboard"
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition"
            >
              ← Overview
            </Link>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Hardware Drop</span>
            </button>
          </div>
        </div>

        {isAddingProduct && (
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-indigo-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Create New Hardware Drop</span>
              </h2>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. AuraSonic Master X Headphones"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Category</label>
                <select
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value as Product["category"])}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none cursor-pointer"
                >
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Workspace">Workspace</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Smart Home">Smart Home</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Price (USD)</label>
                <input
                  type="number"
                  required
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  placeholder="249.00"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Tagline / Key Feature</label>
                <input
                  type="text"
                  value={newProductTagline}
                  onChange={(e) => setNewProductTagline(e.target.value)}
                  placeholder="e.g. Ultra-low latency acoustic drivers"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Publish to Marketplace
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsList.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="aspect-4/3 rounded-2xl overflow-hidden bg-neutral-950 relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                    {p.badge || "Verified"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    {p.category}
                  </span>
                  <h3 className="text-sm font-bold text-white truncate">{p.name}</h3>
                  <div className="text-xs font-black text-white mt-1">${p.price}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2 text-xs">
                <span className="text-emerald-400 font-semibold">{p.stockCount} units available</span>
                <Link
                  href={`/shop/products/${p.id}`}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium"
                >
                  View Live
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
