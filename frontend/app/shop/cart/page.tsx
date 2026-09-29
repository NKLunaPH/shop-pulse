"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Sparkles,
  Tag,
  Check,
  CreditCard,
  Lock,
  ChevronRight,
  Package,
  Clock,
  Heart,
  RotateCcw,
  CheckCircle2,
  Gift,
  HelpCircle,
} from "lucide-react";
import { PRODUCTS, Product } from "../data/products";
import ShopNav, { CartItem } from "../components/ShopNav";

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  shippingMethod: "standard" | "express" | "priority";
  paymentMethod: "card" | "apple" | "paypal" | "crypto";
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  saveInfo: boolean;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: PRODUCTS[0].colors[0]?.name || "Obsidian Black",
    },
    {
      product: PRODUCTS[1],
      quantity: 1,
      selectedColor: PRODUCTS[1].colors[0]?.name || "Space Black",
    },
  ]);

  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent: number;
    description: string;
  } | null>({
    code: "PULSE10",
    discountPercent: 10,
    description: "10% Welcome Discount",
  });
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [includeShippingProtection, setIncludeShippingProtection] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "payment" | "confirmed">("cart");
  const [orderNumber, setOrderNumber] = useState<string>("");

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 382-9104",
    address: "742 Evergreen Terrace",
    city: "San Francisco",
    state: "CA",
    zipCode: "94107",
    shippingMethod: "express",
    paymentMethod: "card",
    cardNumber: "•••• •••• •••• 4242",
    cardExpiry: "12/28",
    cardCvc: "•••",
    saveInfo: true,
  });

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
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
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleSaveForLater = (item: CartItem) => {
    handleRemoveItem(item.product.id);
    setSavedForLater((prev) => [...prev, item]);
  };

  const handleMoveToCart = (item: CartItem) => {
    setSavedForLater((prev) => prev.filter((i) => i.product.id !== item.product.id));
    setCartItems((prev) => [...prev, item]);
  };

  const handleAddCrossSell = (product: Product) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      handleUpdateQuantity(product.id, 1);
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          product,
          quantity: 1,
          selectedColor: product.colors[0]?.name,
        },
      ]);
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === "PULSE10") {
      setAppliedPromo({
        code: "PULSE10",
        discountPercent: 10,
        description: "10% Welcome Discount",
      });
      setPromoSuccess("Promo code 'PULSE10' applied (10% OFF)!");
      setPromoCode("");
    } else if (code === "VIP20") {
      setAppliedPromo({
        code: "VIP20",
        discountPercent: 20,
        description: "20% VIP Member Exclusive",
      });
      setPromoSuccess("VIP code 'VIP20' applied (20% OFF)!");
      setPromoCode("");
    } else if (code === "FREESHIP") {
      setAppliedPromo({
        code: "FREESHIP",
        discountPercent: 0,
        description: "Free Express Shipping",
      });
      setPromoSuccess("Free shipping discount applied!");
      setPromoCode("");
    } else {
      setPromoError("Invalid discount code. Try 'PULSE10' or 'VIP20'");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoSuccess("");
    setPromoError("");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 150;
  const isFreeShippingUnlocked = subtotal >= freeShippingThreshold || appliedPromo?.code === "FREESHIP";
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const discountAmount = appliedPromo
    ? (subtotal * appliedPromo.discountPercent) / 100
    : 0;

  const shippingCost = isFreeShippingUnlocked
    ? 0
    : formData.shippingMethod === "priority"
    ? 24.99
    : formData.shippingMethod === "express"
    ? 14.99
    : 9.99;

  const protectionCost = includeShippingProtection && cartItems.length > 0 ? 4.99 : 0;
  const estimatedTax = (subtotal - discountAmount) * 0.0825;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost + protectionCost + estimatedTax);

  const handlePlaceOrder = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(`SP-${randomNum}`);
    setCheckoutStep("confirmed");
  };

  const crossSellProducts = PRODUCTS.filter(
    (p) => !cartItems.some((item) => item.product.id === p.id)
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <ShopNav
        cart={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <div className="border-b border-neutral-850 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Link
              href="/shop/products"
              className="flex items-center gap-1 hover:text-white transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
            <span>/</span>
            <span className="text-neutral-200 font-semibold">
              {checkoutStep === "cart" && "Shopping Cart"}
              {checkoutStep === "shipping" && "Shipping & Address"}
              {checkoutStep === "payment" && "Payment & Review"}
              {checkoutStep === "confirmed" && "Order Confirmation"}
            </span>
          </div>

          {checkoutStep !== "confirmed" && (
            <div className="flex items-center gap-1 sm:gap-2 text-xs">
              <button
                onClick={() => setCheckoutStep("cart")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  checkoutStep === "cart"
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-neutral-800 text-[10px] flex items-center justify-center font-bold">
                  1
                </span>
                <span>Cart</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />

              <button
                onClick={() => cartItems.length > 0 && setCheckoutStep("shipping")}
                disabled={cartItems.length === 0}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  checkoutStep === "shipping"
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                    : "text-neutral-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-neutral-800 text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                <span>Shipping</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />

              <button
                onClick={() => cartItems.length > 0 && setCheckoutStep("payment")}
                disabled={cartItems.length === 0}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  checkoutStep === "payment"
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                    : "text-neutral-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-neutral-800 text-[10px] flex items-center justify-center font-bold">
                  3
                </span>
                <span>Payment</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {checkoutStep === "confirmed" ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-400">
            <div className="p-8 rounded-3xl bg-neutral-900/70 border border-emerald-500/30 shadow-2xl relative overflow-hidden text-center space-y-4">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Payment Confirmed • Telemetry Synced
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Thank you for your order!
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                  We&apos;ve sent a confirmation email & live pulse tracking receipt to{" "}
                  <span className="text-white font-medium">{formData.email}</span>.
                </p>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
                <div className="px-3.5 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="text-neutral-500">Order ID: </span>
                  <span className="font-bold text-indigo-300">{orderNumber}</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="text-neutral-500">Estimated Delivery: </span>
                  <span className="font-bold text-emerald-300">2-3 Business Days</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="text-neutral-500">Total Charged: </span>
                  <span className="font-bold text-white">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Live Fulfillment Telemetry
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                    <Check className="w-3.5 h-3.5" /> Order Placed
                  </div>
                  <p className="text-[11px] text-neutral-400">Verified & authorized</p>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Package className="w-3.5 h-3.5 text-indigo-400" /> Processing
                  </div>
                  <p className="text-[11px] text-neutral-500">Packaging at warehouse</p>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950/40 border border-neutral-800/80 space-y-1 opacity-70">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
                    <Truck className="w-3.5 h-3.5" /> Express Dispatch
                  </div>
                  <p className="text-[11px] text-neutral-500">Carrier handover</p>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950/40 border border-neutral-800/80 space-y-1 opacity-70">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
                    <Sparkles className="w-3.5 h-3.5" /> Delivered
                  </div>
                  <p className="text-[11px] text-neutral-500">At your doorstep</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Ordered Items ({cartItems.length})</h3>
              <div className="divide-y divide-neutral-800">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-800"
                      />
                      <div>
                        <h4 className="text-xs font-semibold text-white">{item.product.name}</h4>
                        <p className="text-[11px] text-neutral-400">
                          Qty: {item.quantity} • {item.selectedColor}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop/products"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 text-center"
              >
                Back to ShopPulse Store
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-semibold transition cursor-pointer"
              >
                Print Receipt / Invoice
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    {isFreeShippingUnlocked ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Free Express 2-Day Shipping Unlocked!
                      </span>
                    ) : (
                      <span className="text-neutral-300">
                        Add <span className="text-indigo-400 font-bold">${(freeShippingThreshold - subtotal).toFixed(2)}</span> more to unlock Free Express Shipping
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-neutral-400">
                    {Math.round(progressToFreeShipping)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {checkoutStep === "cart" && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-base font-bold text-white">Your Cart Items</h2>
                        <span className="text-xs text-neutral-400">
                          ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
                        </span>
                      </div>

                      {cartItems.length > 0 && (
                        <button
                          onClick={() => setCartItems([])}
                          className="text-xs text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="py-12 text-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 flex items-center justify-center text-neutral-500 mx-auto">
                          <ShoppingCart className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-semibold text-white">Your cart is currently empty</h3>
                        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                          Discover the latest audio equipment, mechanical workspace upgrades, and smart gadgets.
                        </p>
                        <Link
                          href="/shop/products"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold text-white transition mt-2 shadow-lg shadow-indigo-600/25"
                        >
                          <span>Explore Catalog</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ) : (
                      <div className="divide-y divide-neutral-800/80">
                        {cartItems.map((item) => (
                          <div
                            key={item.product.id}
                            className="py-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <Link
                                href={`/shop/products/${item.product.id}`}
                                className="relative aspect-square w-20 h-20 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0 group"
                              >
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition"
                                />
                              </Link>

                              <div className="space-y-1 min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                                  {item.product.category}
                                </span>
                                <Link
                                  href={`/shop/products/${item.product.id}`}
                                  className="block text-sm font-bold text-white hover:text-indigo-400 transition truncate"
                                >
                                  {item.product.name}
                                </Link>

                                <div className="flex items-center gap-3 text-xs text-neutral-400">
                                  <span>Color:</span>
                                  <select
                                    value={item.selectedColor}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setCartItems((prev) =>
                                        prev.map((i) =>
                                          i.product.id === item.product.id
                                            ? { ...i, selectedColor: val }
                                            : i
                                        )
                                      );
                                    }}
                                    className="bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 px-2 py-0.5 outline-none cursor-pointer"
                                  >
                                    {item.product.colors.map((c) => (
                                      <option key={c.name} value={c.name}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="text-xs font-bold text-indigo-400 sm:hidden">
                                  ${item.product.price} each
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-850">
                              <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1">
                                <button
                                  onClick={() => handleUpdateQuantity(item.product.id, -1)}
                                  className="p-1.5 text-neutral-400 hover:text-white rounded transition cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-3 text-xs font-bold text-white select-none">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.product.id, 1)}
                                  className="p-1.5 text-neutral-400 hover:text-white rounded transition cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="text-right min-w-[70px]">
                                <div className="text-sm font-extrabold text-white">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </div>
                                <div className="text-[10px] text-neutral-500">
                                  ${item.product.price}/ea
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleSaveForLater(item)}
                                  className="p-2 text-neutral-500 hover:text-indigo-400 transition cursor-pointer"
                                  title="Save for Later"
                                >
                                  <Heart className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(item.product.id)}
                                  className="p-2 text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                                  title="Remove Item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {savedForLater.length > 0 && (
                    <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <h3 className="text-sm font-bold text-white">
                          Saved For Later ({savedForLater.length})
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {savedForLater.map((item) => (
                          <div
                            key={item.product.id}
                            className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-white truncate">
                                  {item.product.name}
                                </h4>
                                <span className="text-xs font-bold text-indigo-400">
                                  ${item.product.price}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleMoveToCart(item)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition cursor-pointer whitespace-nowrap"
                            >
                              Move to Cart
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {crossSellProducts.length > 0 && (
                    <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                          <h3 className="text-sm font-bold text-white">Recommended Add-ons</h3>
                        </div>
                        <span className="text-xs text-neutral-400">Pair & Save</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {crossSellProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex flex-col justify-between space-y-2 group"
                          >
                            <div className="aspect-16/10 rounded-xl overflow-hidden bg-neutral-900">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                              />
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-white truncate">
                                {prod.name}
                              </h4>
                              <div className="text-xs font-bold text-indigo-400 mt-0.5">
                                ${prod.price}
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddCrossSell(prod)}
                              className="w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-indigo-600 text-neutral-300 hover:text-white border border-neutral-800 hover:border-indigo-500 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add to Order
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === "shipping" && (
                <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-indigo-400" />
                      <h2 className="text-base font-bold text-white">Shipping & Delivery Details</h2>
                    </div>
                    <button
                      onClick={() => setCheckoutStep("cart")}
                      className="text-xs text-indigo-400 hover:underline cursor-pointer"
                    >
                      ← Back to Cart
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Street Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-300">State</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-300">ZIP Code</label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-neutral-800">
                    <label className="text-xs font-bold text-white">Choose Delivery Speed</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, shippingMethod: "standard" })}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                          formData.shippingMethod === "standard"
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex justify-between text-xs font-bold text-white mb-1">
                          <span>Standard Ground</span>
                          <span className="text-indigo-400">
                            {isFreeShippingUnlocked ? "FREE" : "$9.99"}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">4-6 Business Days</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, shippingMethod: "express" })}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                          formData.shippingMethod === "express"
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex justify-between text-xs font-bold text-white mb-1">
                          <span>Express 2-Day</span>
                          <span className="text-emerald-400">
                            {isFreeShippingUnlocked ? "FREE" : "$14.99"}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">2-3 Business Days</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, shippingMethod: "priority" })}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                          formData.shippingMethod === "priority"
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex justify-between text-xs font-bold text-white mb-1">
                          <span>Priority Overnight</span>
                          <span className="text-indigo-400">$24.99</span>
                        </div>
                        <p className="text-[11px] text-neutral-400">Next Business Morning</p>
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCheckoutStep("payment")}
                    className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer mt-4"
                  >
                    <span>Continue to Payment Method</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {checkoutStep === "payment" && (
                <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-400" />
                      <h2 className="text-base font-bold text-white">Payment & Authorization</h2>
                    </div>
                    <button
                      onClick={() => setCheckoutStep("shipping")}
                      className="text-xs text-indigo-400 hover:underline cursor-pointer"
                    >
                      ← Back to Shipping
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "card" })}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer text-xs font-semibold ${
                        formData.paymentMethod === "card"
                          ? "border-indigo-500 bg-indigo-500/10 text-white"
                          : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Credit Card
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "apple" })}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer text-xs font-semibold ${
                        formData.paymentMethod === "apple"
                          ? "border-indigo-500 bg-indigo-500/10 text-white"
                          : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Apple Pay
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "paypal" })}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer text-xs font-semibold ${
                        formData.paymentMethod === "paypal"
                          ? "border-indigo-500 bg-indigo-500/10 text-white"
                          : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white"
                      }`}
                    >
                      PayPal
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "crypto" })}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer text-xs font-semibold ${
                        formData.paymentMethod === "crypto"
                          ? "border-indigo-500 bg-indigo-500/10 text-white"
                          : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white"
                      }`}
                    >
                      Solana / USDC
                    </button>
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-300">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none pl-10"
                          />
                          <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-neutral-300">Expiration Date</label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-neutral-300">Security CVC</label>
                          <input
                            type="password"
                            value={formData.cardCvc}
                            onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3.5 rounded-2xl bg-neutral-950/50 border border-neutral-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-neutral-500">Shipping to: </span>
                      <span className="text-neutral-300 font-medium">
                        {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep("shipping")}
                      className="text-indigo-400 hover:underline font-semibold cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Place Order • ${grandTotal.toFixed(2)}</span>
                  </button>

                  <div className="text-center text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>256-bit encrypted checkout with ShopPulse Buyer Protection</span>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-5 sticky top-24">
                <h3 className="text-base font-bold text-white pb-3 border-b border-neutral-800">
                  Order Summary
                </h3>

                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Discount code (e.g. VIP20)"
                        className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white uppercase outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {promoError && (
                    <p className="text-[11px] text-rose-400 font-medium">{promoError}</p>
                  )}
                  {promoSuccess && (
                    <p className="text-[11px] text-emerald-400 font-medium">{promoSuccess}</p>
                  )}

                  {appliedPromo && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>{appliedPromo.code} ({appliedPromo.description})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-neutral-500 hover:text-rose-400 text-[11px] transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Shipping Guarantee</div>
                      <div className="text-[11px] text-neutral-500">Instant reshipment if lost or damaged</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeShippingProtection}
                      onChange={(e) => setIncludeShippingProtection(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="space-y-2.5 text-xs pt-2 border-t border-neutral-800">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({appliedPromo?.discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400">
                    <span>Estimated Shipping</span>
                    <span className="text-white font-medium">
                      {isFreeShippingUnlocked ? (
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {includeShippingProtection && cartItems.length > 0 && (
                    <div className="flex justify-between text-neutral-400">
                      <span>Shipping Protection</span>
                      <span className="text-white font-medium">${protectionCost.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400">
                    <span>Estimated Tax</span>
                    <span className="text-white font-medium">${estimatedTax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-white pt-3 border-t border-neutral-800">
                    <span>Grand Total</span>
                    <span className="text-indigo-400">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {checkoutStep === "cart" && (
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("shipping")}
                    disabled={cartItems.length === 0}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Proceed to Shipping Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-neutral-500">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>30-Day Money Back</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>SSL Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-neutral-900 bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500 mt-auto">
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
