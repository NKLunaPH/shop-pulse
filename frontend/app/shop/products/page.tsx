"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Star,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  SlidersHorizontal,
  Check,
  Plus,
  Flame,
} from "lucide-react";
import { PRODUCTS as FALLBACK_PRODUCTS, Product } from "../data/products";
import ShopNav, { CartItem } from "../components/ShopNav";
import { api } from "@/lib/api";

export default function ProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: FALLBACK_PRODUCTS[0],
      quantity: 1,
      selectedColor: "Obsidian Black",
    },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"pulse" | "price-asc" | "price-desc" | "rating">("pulse");
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.products.getAll()
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setProductsList(res.data);
        }
      })
      .catch((err) => {
        console.warn("Using offline catalog fallback:", err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ["All", "Audio", "Wearables", "Workspace", "Gaming", "Smart Home"];

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedColor: product.colors[0]?.name,
        },
      ];
    });

    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= maxPrice;

      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === "pulse") return b.pulseScore - a.pulseScore;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [productsList, selectedCategory, searchQuery, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <ShopNav
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <section className="relative border-b border-neutral-850 bg-gradient-to-b from-neutral-900/50 to-neutral-950/20 py-10 sm:py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Trending Drops • Live Pulse Score Tracking</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Curated gear engineered for{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-rose-300 bg-clip-text text-transparent">
                peak performance.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
              Explore high-fidelity studio acoustics, mechanical desk essentials, and titanium biometric wearables backed by real-time delivery telemetry.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                    : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "pulse" | "price-asc" | "price-desc" | "rating"
                  )
                }
                className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:border-indigo-500 outline-none cursor-pointer"
              >
                <option value="pulse">🔥 Highest Pulse Heat</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="price-asc">💵 Price: Low to High</option>
                <option value="price-desc">💎 Price: High to Low</option>
              </select>
            </div>

            <div className="text-xs text-neutral-500 font-medium">
              Showing <span className="text-white font-bold">{filteredProducts.length}</span> items
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No products found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              We couldn&apos;t find anything matching your search & filters. Try adjusting your query or category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setMaxPrice(500);
              }}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const discountPercent = Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              );
              const isAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="group bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700/80 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-neutral-950">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {product.badge && (
                        <span className="px-2.5 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-[10px] font-bold tracking-wide uppercase text-white shadow-md">
                          {product.badge}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="px-2 py-1 rounded-full bg-rose-500/90 backdrop-blur-md text-[10px] font-bold text-white shadow-md">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.pulseScore} Pulse</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-400">
                        <span className="text-indigo-400 font-semibold uppercase tracking-wider text-[10px]">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 font-medium text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-neutral-500 text-[11px]">
                            ({product.reviewsCount})
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/shop/products/${product.id}`}
                        className="block group-hover:text-indigo-400 transition"
                      >
                        <h2 className="text-base font-bold text-white tracking-tight leading-snug line-clamp-1">
                          {product.name}
                        </h2>
                      </Link>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {product.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      {product.colors.map((color) => (
                        <span
                          key={color.name}
                          title={color.name}
                          className="w-3.5 h-3.5 rounded-full border border-neutral-700 inline-block shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>

                    <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-extrabold text-white">
                            ${product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-neutral-500 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5">
                          <Zap className="w-2.5 h-2.5" /> In Stock & Ready
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/shop/products/${product.id}`}
                          className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition"
                        >
                          Details
                        </Link>

                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className={`p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
                          }`}
                          aria-label="Add to cart"
                        >
                          {isAdded ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <section className="pt-12 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-neutral-850">
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Free Express Shipping</h3>
              <p className="text-[11px] text-neutral-400">On all qualifying orders over $150</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">30-Day Hassle-Free Returns</h3>
              <p className="text-[11px] text-neutral-400">Prepaid label with automated refund</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">2-Year Official Warranty</h3>
              <p className="text-[11px] text-neutral-400">Full coverage on hardware & parts</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-neutral-900 bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500">
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
