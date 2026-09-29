"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  User,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

interface ShopNavProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function ShopNav({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  searchQuery = "",
  onSearchChange,
}: ShopNavProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutCompleted, setIsCheckoutCompleted] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );

  const handleCheckout = () => {
    setIsCheckoutCompleted(true);
    setTimeout(() => {
      setIsCheckoutCompleted(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-neutral-950/80 border-b border-neutral-850">
        <div className="bg-gradient-to-r from-indigo-900/60 via-violet-900/40 to-indigo-900/60 border-b border-indigo-500/20 px-4 py-1.5 text-center text-xs font-medium text-indigo-200 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            ⚡ Flash Deal Week: Get free express 2-day shipping on all orders over $150
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/shop/products"
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="leading-none flex items-center gap-0.5">
                Shop<span className="text-indigo-400">Pulse</span>
              </span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-normal">
                Store
              </span>
            </div>
          </Link>

          {onSearchChange && (
            <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search headphones, keyboards, smartwatches..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-900/90 border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-full text-xs text-white placeholder-neutral-500 transition outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <Link
              href="/shop/vendors"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Vendors</span>
            </Link>

            <Link
              href="/dashboard/customer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition"
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Account</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-neutral-950 text-indigo-300 text-[11px] font-bold px-1.5 py-0.5 rounded-full border border-indigo-400/40">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </header>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative w-full max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Your Shopping Cart</h3>
                <span className="text-xs text-neutral-400">({totalItems} items)</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-neutral-950/60 border-b border-neutral-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-neutral-400 font-medium">
                  {subtotal >= freeShippingThreshold ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> You unlocked FREE Express Shipping!
                    </span>
                  ) : (
                    `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping`
                  )}
                </span>
                <span className="text-neutral-300 font-semibold">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 flex items-center justify-center text-neutral-500">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-semibold text-white">Your cart is empty</h4>
                  <p className="text-xs text-neutral-400 max-w-xs">
                    Explore trending audio gear, mechanical keyboards, and smart tech to fill it up!
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-neutral-950/50 border border-neutral-800 rounded-2xl flex gap-3.5 items-center"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-neutral-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {item.product.name}
                      </h4>
                      {item.selectedColor && (
                        <p className="text-[11px] text-neutral-400">
                          Color: {item.selectedColor}
                        </p>
                      )}
                      <div className="text-xs font-bold text-indigo-400 mt-1">
                        ${item.product.price}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded transition cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-neutral-800 bg-neutral-950/80 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-medium">
                      {subtotal >= freeShippingThreshold ? "FREE" : "$9.99"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                    <span>Estimated Total</span>
                    <span className="text-indigo-400">
                      $
                      {(
                        subtotal + (subtotal >= freeShippingThreshold ? 0 : 9.99)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {isCheckoutCompleted ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold">Order placed successfully!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/shop/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition text-center"
                    >
                      <span>View Full Cart & Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={handleCheckout}
                      className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <span>⚡ 1-Click Instant Express Checkout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
