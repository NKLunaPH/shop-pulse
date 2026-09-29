"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  Flame,
  Zap,
  ShoppingBag,
  Sparkles,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { PRODUCTS, Product } from "../../data/products";
import ShopNav, { CartItem } from "../../components/ShopNav";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) || PRODUCTS[0].id;

  const product: Product =
    PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || "Default"
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "reviews">("features");
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[1],
      quantity: 1,
      selectedColor: "Space Black",
    },
  ]);

  const handleAddToCart = () => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor,
        },
      ];
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleUpdateQuantity = (pId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === pId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (pId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== pId));
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <ShopNav
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <div className="border-b border-neutral-850 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Link
              href="/shop/products"
              className="flex items-center gap-1 hover:text-white transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
            <span>/</span>
            <span className="text-neutral-500">{product.category}</span>
            <span>/</span>
            <span className="text-neutral-200 font-semibold truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </div>

          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-xl border border-neutral-800 transition cursor-pointer flex items-center gap-1.5 ${
              isLiked ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "hover:bg-neutral-800 text-neutral-400"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-400" : ""}`} />
            <span className="hidden sm:inline text-xs">{isLiked ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
              <img
                src={product.images[selectedImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition duration-300"
              />

              <div className="absolute top-4 left-4 flex gap-2">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    {product.badge}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-full bg-rose-500/90 backdrop-blur-md text-xs font-bold text-white shadow-lg">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-xs font-bold text-amber-400 flex items-center gap-1.5 shadow-lg">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.pulseScore} Pulse Score</span>
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-4/3 rounded-2xl overflow-hidden border transition cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-indigo-500 ring-2 ring-indigo-500/40"
                        : "border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {product.category}
                </span>
                <span className="text-neutral-600">•</span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-neutral-500 font-normal">
                    ({product.reviewsCount} verified reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-white">
                    ${product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base text-neutral-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <Zap className="w-3 h-3" /> In Stock & Ready to Dispatch (Free 2-day delivery)
                </div>
              </div>

              <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                ${product.originalPrice - product.price} Saved
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-neutral-300">
                  Color Variant:{" "}
                  <span className="text-indigo-400 font-bold">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                      selectedColor === color.name
                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                        : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full inline-block border border-neutral-700 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-bold text-white select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-lg ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-[0.99]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Added to Your Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-neutral-800/80">
              <div className="p-2.5 rounded-xl bg-neutral-900/40 border border-neutral-800 text-center">
                <Truck className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                <div className="text-[10px] font-bold text-white">Free Express</div>
                <div className="text-[9px] text-neutral-500">2-3 Business Days</div>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900/40 border border-neutral-800 text-center">
                <RotateCcw className="w-4 h-4 text-violet-400 mx-auto mb-1" />
                <div className="text-[10px] font-bold text-white">30-Day Return</div>
                <div className="text-[9px] text-neutral-500">No Questions Asked</div>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900/40 border border-neutral-800 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="text-[10px] font-bold text-white">2-Yr Warranty</div>
                <div className="text-[9px] text-neutral-500">Official ShopPulse</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-neutral-800 rounded-3xl bg-neutral-900/40 overflow-hidden">
          <div className="flex border-b border-neutral-800 bg-neutral-950/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab("features")}
              className={`px-6 py-4 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === "features"
                  ? "border-b-2 border-indigo-500 text-white bg-neutral-900/50"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Key Features & Overview
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-4 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === "specs"
                  ? "border-b-2 border-indigo-500 text-white bg-neutral-900/50"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-4 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                activeTab === "reviews"
                  ? "border-b-2 border-indigo-500 text-white bg-neutral-900/50"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Customer Reviews ({product.reviewsCount})
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === "features" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">
                    Product Description
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white mb-3">
                    Highlighted Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800"
                      >
                        <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], idx) => (
                      <tr
                        key={key}
                        className={`border-b border-neutral-800/80 ${
                          idx % 2 === 0 ? "bg-neutral-950/40" : "bg-transparent"
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-neutral-400 w-1/3">
                          {key}
                        </td>
                        <td className="py-3 px-4 text-white font-medium">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-black text-white">{product.rating}</div>
                    <div>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        Based on {product.reviewsCount} verified purchases
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold rounded-xl text-white transition">
                    Write a Review
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                          DK
                        </div>
                        <span className="text-xs font-bold text-white">David K.</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                          Verified Buyer
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500">2 days ago</span>
                    </div>
                    <p className="text-xs text-neutral-300">
                      &ldquo;Absolute top tier craftsmanship. The noise cancellation and audio stage completely blew away my expectations. Dispatched in less than 24 hours!&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Related Pulse Recommendations
            </h3>
            <Link
              href="/shop/products"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View all products →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/shop/products/${rel.id}`}
                className="group bg-neutral-900/40 hover:bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-4 transition-all duration-300 block"
              >
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-neutral-950 mb-3">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {rel.category}
                </div>
                <h4 className="text-sm font-bold text-white truncate mt-1">
                  {rel.name}
                </h4>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800">
                  <span className="text-sm font-extrabold text-white">${rel.price}</span>
                  <span className="text-xs text-amber-400 flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    {rel.pulseScore}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
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
