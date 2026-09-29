"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ExternalLink,
  MapPin,
  Heart,
  Award,
  Users,
  Check,
} from "lucide-react";
import { PRODUCTS } from "../data/products";
import ShopNav, { CartItem } from "../components/ShopNav";
import { api } from "@/lib/api";

export interface Vendor {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "Audio" | "Wearables" | "Workspace" | "Gaming" | "Smart Home";
  rating: number;
  reviewsCount: number;
  ordersFulfilled: number;
  dispatchRate: number;
  avgResponseTime: string;
  location: string;
  badge: "Flagship Partner" | "Pulse Prime" | "Master Artisan" | "Esports Verified";
  logo: string;
  banner: string;
  featuredProductIds: string[];
  followers: number;
  established: string;
}

const VENDORS: Vendor[] = [
  {
    id: "aurasonic-acoustics",
    name: "AuraSonic Acoustics",
    tagline: "Studio-grade transducer engineering & hybrid noise-cancelling acoustics.",
    description:
      "Crafted in Munich, AuraSonic delivers master-tuned dynamic drivers and spatial head-tracking headsets built for audio purists and mixing engineers.",
    category: "Audio",
    rating: 4.9,
    reviewsCount: 3240,
    ordersFulfilled: 18450,
    dispatchRate: 99.8,
    avgResponseTime: "< 10 min",
    location: "Munich, Germany",
    badge: "Flagship Partner",
    logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=80",
    featuredProductIds: ["pulse-anc-headphones", "pulse-sonic-soundbar"],
    followers: 12840,
    established: "2019",
  },
  {
    id: "kronos-dynamics",
    name: "Kronos BioDynamics",
    tagline: "Aerospace titanium biometric telemetry & sapphire display smartwatches.",
    description:
      "Pioneering continuous heart rate variability tracking, ECG telemetry, and deep-sea water resistance housed within grade-5 titanium cases.",
    category: "Wearables",
    rating: 4.8,
    reviewsCount: 1980,
    ordersFulfilled: 12300,
    dispatchRate: 99.5,
    avgResponseTime: "15 min",
    location: "Zurich, Switzerland",
    badge: "Pulse Prime",
    logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1200&auto=format&fit=crop&q=80",
    featuredProductIds: ["pulse-quantum-smartwatch"],
    followers: 9450,
    established: "2021",
  },
  {
    id: "apexforge-studios",
    name: "ApexForge Studio",
    tagline: "CNC milled gasket-mount mechanical keyboards and acoustic dampening.",
    description:
      "Precision custom keyboards with factory-lubed linear switches, hot-swappable sockets, and sound profiles tuned to perfection for speed and tactile feedback.",
    category: "Workspace",
    rating: 4.9,
    reviewsCount: 2450,
    ordersFulfilled: 15600,
    dispatchRate: 99.9,
    avgResponseTime: "8 min",
    location: "Tokyo, Japan",
    badge: "Master Artisan",
    logo: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1200&auto=format&fit=crop&q=80",
    featuredProductIds: ["pulse-apex-mechanical-keyboard"],
    followers: 16200,
    established: "2020",
  },
  {
    id: "phantom-peripherals",
    name: "Phantom Pro Esports",
    tagline: "49g ultra-lightweight 4K wireless esports peripherals & 32K sensors.",
    description:
      "Engineered alongside competitive champions. Zero-latency optical microswitches, pure PTFE skates, and true 4000Hz polling rate architecture.",
    category: "Gaming",
    rating: 4.9,
    reviewsCount: 1820,
    ordersFulfilled: 14100,
    dispatchRate: 99.7,
    avgResponseTime: "12 min",
    location: "Seoul, South Korea",
    badge: "Esports Verified",
    logo: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200&auto=format&fit=crop&q=80",
    featuredProductIds: ["pulse-phantom-wireless-mouse"],
    followers: 11900,
    established: "2022",
  },
  {
    id: "lumina-ambient-labs",
    name: "Lumina Matrix Labs",
    tagline: "Dynamic monitor illumination & asymmetric optical screen lightbars.",
    description:
      "Intelligent workspace illumination with rear ambient sound reaction, Ra95 color fidelity, and stepless color temperature puck controllers.",
    category: "Smart Home",
    rating: 4.7,
    reviewsCount: 1410,
    ordersFulfilled: 9800,
    dispatchRate: 99.2,
    avgResponseTime: "18 min",
    location: "San Francisco, USA",
    badge: "Pulse Prime",
    logo: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=300&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop&q=80",
    featuredProductIds: ["pulse-lumina-smart-lightbar"],
    followers: 7890,
    established: "2021",
  },
];

export default function VendorsPage() {
  const [vendorsList, setVendorsList] = useState<Vendor[]>(VENDORS);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: "Obsidian Black",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rating" | "orders" | "followers" | "dispatch">("rating");
  const [followedVendors, setFollowedVendors] = useState<Record<string, boolean>>({
    "aurasonic-acoustics": true,
  });
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<Vendor | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.vendors.getAll()
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          setVendorsList(res.data);
        }
      })
      .catch((err) => {
        console.warn("Using offline vendor fallback:", err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ["All", "Audio", "Wearables", "Workspace", "Gaming", "Smart Home"];

  const handleToggleFollow = (vendorId: string) => {
    setFollowedVendors((prev) => ({
      ...prev,
      [vendorId]: !prev[vendorId],
    }));
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

  const filteredVendors = useMemo(() => {
    return vendorsList.filter((vendor) => {
      const matchesCategory =
        selectedCategory === "All" || vendor.category === selectedCategory;
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "orders") return b.ordersFulfilled - a.ordersFulfilled;
      if (sortBy === "followers") return b.followers - a.followers;
      if (sortBy === "dispatch") return b.dispatchRate - a.dispatchRate;
      return 0;
    });
  }, [vendorsList, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <ShopNav
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <section className="relative border-b border-neutral-850/80 bg-neutral-900/30 py-12 sm:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Verified Creator & Hardware Lab Directory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Official ShopPulse{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                Vendor Flagships
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
              Discover boutique acoustics studios, Swiss biometric telemetry engineers, and custom CNC mechanical keyboard ateliers verified by ShopPulse buyer protection.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                    : "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendor or city..."
                className="w-full pl-9 pr-3.5 py-2 bg-neutral-900/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "rating" | "orders" | "followers" | "dispatch"
                  )
                }
                className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-xl px-3 py-2 focus:border-indigo-500 outline-none cursor-pointer"
              >
                <option value="rating">⭐ Highest Rated</option>
                <option value="orders">📦 Most Orders Fulfilled</option>
                <option value="followers">👥 Most Followed</option>
                <option value="dispatch">⚡ 99%+ On-Time Dispatch</option>
              </select>
            </div>
          </div>
        </div>

        {filteredVendors.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">No verified vendors found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              We couldn&apos;t find any partners matching your search. Try resetting your query or category filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredVendors.map((vendor) => {
              const isFollowed = !!followedVendors[vendor.id];
              const featuredProducts = PRODUCTS.filter((p) =>
                vendor.featuredProductIds.includes(p.id)
              );

              return (
                <div
                  key={vendor.id}
                  className="group bg-neutral-900/60 hover:bg-neutral-900/90 border border-neutral-800 hover:border-indigo-500/40 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1"
                >
                  <div className="relative h-32 sm:h-36 overflow-hidden bg-neutral-950">
                    <img
                      src={vendor.banner}
                      alt={vendor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-[10px] font-bold tracking-wide uppercase text-white shadow-md flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>{vendor.badge}</span>
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleFollow(vendor.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shadow-md ${
                          isFollowed
                            ? "bg-indigo-600 text-white"
                            : "bg-neutral-950/80 backdrop-blur-md hover:bg-neutral-800 text-neutral-300 border border-neutral-700"
                        }`}
                      >
                        {isFollowed ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-3 h-3" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5 -mt-8 relative z-10">
                    <div className="space-y-3">
                      <div className="flex items-end gap-3.5">
                        <img
                          src={vendor.logo}
                          alt={vendor.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-neutral-800 bg-neutral-950 shadow-xl shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-white tracking-tight truncate">
                              {vendor.name}
                            </h2>
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                            <span className="text-indigo-400 font-medium">{vendor.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-500" />
                              {vendor.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {vendor.tagline}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center">
                      <div>
                        <div className="text-xs font-black text-amber-400 flex items-center justify-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{vendor.rating}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          ({vendor.reviewsCount})
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-black text-white">
                          {(vendor.ordersFulfilled / 1000).toFixed(1)}k
                        </div>
                        <div className="text-[10px] text-neutral-500">Fulfilled</div>
                      </div>

                      <div>
                        <div className="text-xs font-black text-emerald-400">
                          {vendor.dispatchRate}%
                        </div>
                        <div className="text-[10px] text-neutral-500">On-Time</div>
                      </div>

                      <div>
                        <div className="text-xs font-black text-cyan-400">
                          {vendor.avgResponseTime}
                        </div>
                        <div className="text-[10px] text-neutral-500">Response</div>
                      </div>
                    </div>

                    {featuredProducts.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                          Featured Pulse Releases
                        </span>
                        <div className="grid grid-cols-2 gap-2.5">
                          {featuredProducts.map((prod) => (
                            <Link
                              key={prod.id}
                              href={`/shop/products/${prod.id}`}
                              className="p-2 rounded-xl bg-neutral-950/50 hover:bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 flex items-center gap-2.5 transition group/prod"
                            >
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover border border-neutral-800 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-white truncate group-hover/prod:text-indigo-400 transition">
                                  {prod.name}
                                </div>
                                <div className="text-xs font-bold text-indigo-400">
                                  ${prod.price}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{(vendor.followers + (isFollowed ? 1 : 0)).toLocaleString()} pulse followers</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedVendorForModal(vendor)}
                          className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition cursor-pointer"
                        >
                          Vendor Story
                        </button>
                        <Link
                          href="/shop/products"
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                        >
                          <span>Storefront</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-neutral-900/80 to-neutral-900/60 border border-indigo-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Direct Hardware Manufacturer Program
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Sell your high-performance hardware on ShopPulse
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Join our network of verified makers and audio ateliers. Access zero-fraud telemetry, instant payouts, and global express fulfillment.
            </p>
          </div>

          <Link
            href="/auth/register"
            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>Apply as Vendor Partner</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </section>
      </main>

      {selectedVendorForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedVendorForModal(null)}
          />

          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-32 bg-neutral-950">
              <img
                src={selectedVendorForModal.banner}
                alt={selectedVendorForModal.name}
                className="w-full h-full object-cover opacity-60"
              />
              <button
                onClick={() => setSelectedVendorForModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-neutral-950/80 text-neutral-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 -mt-10 relative z-10">
              <div className="flex items-end gap-3.5">
                <img
                  src={selectedVendorForModal.logo}
                  alt={selectedVendorForModal.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-neutral-800 bg-neutral-950 shadow-xl"
                />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedVendorForModal.name}
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Established in {selectedVendorForModal.established} • {selectedVendorForModal.location}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Engineering Philosophy
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {selectedVendorForModal.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> 24-Hour Dispatch
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    {selectedVendorForModal.dispatchRate}% verified adherence
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs">
                  <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> 2-Yr Official Warranty
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    ShopPulse Buyer Guarantee
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedVendorForModal(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-xl text-neutral-300 transition cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/shop/products"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded-xl text-white transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full border-t border-neutral-900 bg-neutral-950/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500 mt-auto">
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
