"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Tag,
  CreditCard,
  Sparkles,
  ChevronRight,
  Package,
  Clock,
  Check,
  AlertCircle,
  HelpCircle,
  QrCode,
  Smartphone,
  Info,
  Calendar,
  Layers,
  MapPin,
} from "lucide-react";
import { PRODUCTS, Product } from "../data/products";
import ShopNav, { CartItem } from "../components/ShopNav";
import { api } from "@/lib/api";

interface CheckoutFormData {
  email: string;
  phone: string;
  smsUpdates: boolean;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  sameBilling: boolean;
  shippingMethod: "standard" | "express" | "priority";
  paymentMethod: "card" | "apple" | "paypal" | "crypto" | "klarna";
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;
  saveCard: boolean;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: "Obsidian Black",
    },
    {
      product: PRODUCTS[1],
      quantity: 1,
      selectedColor: "Space Black",
    },
  ]);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "alex.rivera@example.com",
    phone: "+1 (555) 382-9104",
    smsUpdates: true,
    firstName: "Alex",
    lastName: "Rivera",
    company: "",
    address: "742 Evergreen Terrace",
    apartment: "Suite 4B",
    city: "San Francisco",
    state: "CA",
    zipCode: "94107",
    country: "United States",
    sameBilling: true,
    shippingMethod: "express",
    paymentMethod: "card",
    cardNumber: "4532 •••• •••• 8892",
    cardName: "Alex Rivera",
    cardExpiry: "08/28",
    cardCvc: "842",
    saveCard: true,
  });

  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPercent: number;
    description: string;
  } | null>({
    code: "PULSE10",
    discountPercent: 10,
    description: "10% Welcome Discount",
  });

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [includeProtection, setIncludeProtection] = useState(true);
  const [currentStep, setCurrentStep] = useState<"details" | "payment" | "success">("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 150;
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedPromo?.code === "FREESHIP";

  const discountAmount = appliedPromo
    ? (subtotal * appliedPromo.discountPercent) / 100
    : 0;

  const shippingCost = isFreeShipping
    ? 0
    : formData.shippingMethod === "priority"
    ? 24.99
    : formData.shippingMethod === "express"
    ? 14.99
    : 9.99;

  const protectionCost = includeProtection && cartItems.length > 0 ? 4.99 : 0;
  const estimatedTax = (subtotal - discountAmount) * 0.0825;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost + protectionCost + estimatedTax);
  const installmentAmount = (grandTotal / 4).toFixed(2);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === "PULSE10") {
      setAppliedPromo({
        code: "PULSE10",
        discountPercent: 10,
        description: "10% Welcome Discount",
      });
      setPromoMessage({ text: "Coupon PULSE10 applied! (10% off)", isError: false });
      setPromoInput("");
    } else if (code === "VIP20") {
      setAppliedPromo({
        code: "VIP20",
        discountPercent: 20,
        description: "20% VIP Exclusive",
      });
      setPromoMessage({ text: "VIP code applied! (20% off)", isError: false });
      setPromoInput("");
    } else if (code === "FREESHIP") {
      setAppliedPromo({
        code: "FREESHIP",
        discountPercent: 0,
        description: "Free Express Shipping",
      });
      setPromoMessage({ text: "Free shipping promo applied!", isError: false });
      setPromoInput("");
    } else {
      setPromoMessage({ text: "Invalid promo code. Try 'PULSE10' or 'VIP20'", isError: true });
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    const generatedId = `SP-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const orderPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim() || "Alex Rivera",
        email: formData.email || "alex.rivera@example.com",
        items: cartItems.map((ci) => ({
          productId: ci.product.id,
          productName: ci.product.name,
          quantity: ci.quantity,
          color: ci.selectedColor,
          price: ci.product.price,
        })),
        subtotal,
        discount: discountAmount,
        shipping: shippingCost,
        tax: estimatedTax,
        total: grandTotal,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        paymentMethod: formData.paymentMethod === "card" ? "Credit Card" : formData.paymentMethod.toUpperCase(),
      };
      const res = await api.orders.checkout(orderPayload);
      if (res.data?.id) {
        setOrderId(res.data.id);
      } else {
        setOrderId(generatedId);
      }
    } catch (err: unknown) {
      console.warn("Backend order submission error, fallback to client order simulation:", (err as Error).message);
      setOrderId(generatedId);
    } finally {
      setIsSubmitting(false);
      setCurrentStep("success");
    }
  };

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

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <ShopNav
        cart={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <div className="border-b border-neutral-850 bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/shop/cart"
              className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cart</span>
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Encrypted Secure Checkout
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Protection
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline">Guaranteed Dispatch within 24h</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        {currentStep === "success" ? (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-400">
            <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900/80 border border-emerald-500/40 shadow-2xl relative overflow-hidden text-center space-y-4">
              <div className="absolute -top-28 -left-28 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-28 -right-28 w-56 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 animate-bounce">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Order Successfully Placed
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Thank You, {formData.firstName}!
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
                  Your order confirmation and tracking details have been sent to{" "}
                  <span className="text-white font-semibold">{formData.email}</span>.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
                <div className="px-4 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="text-neutral-500">Order Number: </span>
                  <span className="font-mono font-bold text-indigo-400">{orderId}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="text-neutral-500">Estimated Arrival: </span>
                  <span className="font-bold text-emerald-400">2-3 Business Days</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <span className="text-neutral-500">Payment: </span>
                  <span className="font-bold text-white">${grandTotal.toFixed(2)} Authorized</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Live Fulfillment Status</h3>
                </div>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Live Tracking Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Authorized
                  </div>
                  <p className="text-[11px] text-neutral-400">Payment cleared instantly</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Package className="w-4 h-4 text-indigo-400" /> Pick & Pack
                  </div>
                  <p className="text-[11px] text-neutral-400">Warehouse allocation</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950/40 border border-neutral-850 space-y-1 opacity-70">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
                    <Truck className="w-4 h-4 text-neutral-500" /> In Transit
                  </div>
                  <p className="text-[11px] text-neutral-500">Carrier dispatch</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950/40 border border-neutral-850 space-y-1 opacity-70">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400">
                    <Sparkles className="w-4 h-4 text-neutral-500" /> Delivered
                  </div>
                  <p className="text-[11px] text-neutral-500">Signature on delivery</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-start gap-3 mt-4 text-xs">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-white">Shipping Address</div>
                  <div className="text-neutral-400">
                    {formData.firstName} {formData.lastName} • {formData.address}{" "}
                    {formData.apartment && `(${formData.apartment})`}, {formData.city},{" "}
                    {formData.state} {formData.zipCode}
                  </div>
                  <div className="text-[11px] text-neutral-500">Contact: {formData.phone}</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Package Manifest ({cartItems.length} items)</h3>
              <div className="divide-y divide-neutral-800">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-neutral-800 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.product.name}</h4>
                        <p className="text-[11px] text-neutral-400">
                          Color: {item.selectedColor} • Qty: {item.quantity}
                        </p>
                        <span className="text-[10px] text-indigo-400 font-medium">
                          2-Year Warranty Included
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-neutral-500">${item.product.price}/ea</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/shop/products"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xl shadow-indigo-600/30 text-center"
              >
                Back to ShopPulse Catalog
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-semibold transition cursor-pointer"
              >
                Download PDF Invoice
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Express 1-Touch Checkout
                  </span>
                  <span className="text-[11px] text-neutral-500">Instant Authorization</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      setFormData({ ...formData, paymentMethod: "apple" });
                      handlePlaceOrder();
                    }}
                    className="py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Pay with Apple</span>
                  </button>

                  <button
                    onClick={() => {
                      setFormData({ ...formData, paymentMethod: "paypal" });
                      handlePlaceOrder();
                    }}
                    className="py-3 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f4b82d] text-[#003087] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <span>PayPal</span>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, paymentMethod: "crypto" })}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Solana Pay</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center pt-2">
                  <div className="border-t border-neutral-800 w-full" />
                  <span className="bg-neutral-900 px-3 text-[11px] text-neutral-500 font-medium absolute uppercase tracking-widest">
                    Or pay with details
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base font-bold text-white">Contact & Communication</h2>
                  </div>
                  <Link
                    href="/auth/login"
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Already have an account? Log in
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">
                      Email Address (for order tracking receipt)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">
                      Mobile Phone Number (for delivery SMS notification)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={formData.smsUpdates}
                      onChange={(e) => setFormData({ ...formData, smsUpdates: e.target.checked })}
                      className="rounded bg-neutral-900 border-neutral-800 text-indigo-600 focus:ring-0"
                    />
                    <span>Send me real-time shipment updates & dispatch telemetry via SMS</span>
                  </label>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base font-bold text-white">Shipping Address</h2>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Address Auto-verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">Street Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">
                      Apartment, Suite, Unit (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-300">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">ZIP Code</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-neutral-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white">Shipping Speed & Carrier</label>
                    <span className="text-[11px] text-neutral-400">FedEx / UPS Express</span>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, shippingMethod: "standard" })}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                        formData.shippingMethod === "standard"
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            formData.shippingMethod === "standard"
                              ? "border-indigo-500 bg-indigo-600"
                              : "border-neutral-700"
                          }`}
                        >
                          {formData.shippingMethod === "standard" && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-white">Standard Ground Delivery</div>
                          <div className="text-[11px] text-neutral-400">4-6 Business Days</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-neutral-300">
                        {isFreeShipping ? "FREE" : "$9.99"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, shippingMethod: "express" })}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                        formData.shippingMethod === "express"
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            formData.shippingMethod === "express"
                              ? "border-indigo-500 bg-indigo-600"
                              : "border-neutral-700"
                          }`}
                        >
                          {formData.shippingMethod === "express" && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>Pulse Express 2-Day Air</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                              Popular
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-400">2-3 Business Days</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        {isFreeShipping ? "FREE" : "$14.99"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, shippingMethod: "priority" })}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition cursor-pointer ${
                        formData.shippingMethod === "priority"
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-neutral-800 bg-neutral-950/50 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            formData.shippingMethod === "priority"
                              ? "border-indigo-500 bg-indigo-600"
                              : "border-neutral-700"
                          }`}
                        >
                          {formData.shippingMethod === "priority" && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-white">Priority Overnight Air</div>
                          <div className="text-[11px] text-neutral-400">Next Morning by 10:30 AM</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white">$24.99</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h2 className="text-base font-bold text-white">Payment Method</h2>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Encrypted</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "card" })}
                    className={`py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                      formData.paymentMethod === "card"
                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                        : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white"
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "klarna" })}
                    className={`py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                      formData.paymentMethod === "klarna"
                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                        : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white"
                    }`}
                  >
                    4-Pay / Klarna
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: "paypal" })}
                    className={`py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
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
                    className={`py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                      formData.paymentMethod === "crypto"
                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                        : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-white"
                    }`}
                  >
                    Solana / Crypto
                  </button>
                </div>

                {formData.paymentMethod === "card" && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Cardholder Name</label>
                      <input
                        type="text"
                        value={formData.cardName}
                        onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-neutral-300">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none font-mono"
                        />
                        <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-300">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={formData.cardExpiry}
                          onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                          className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none text-center font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-300">Security CVC</label>
                        <input
                          type="password"
                          value={formData.cardCvc}
                          onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                          className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none text-center font-mono"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={formData.saveCard}
                        onChange={(e) => setFormData({ ...formData, saveCard: e.target.checked })}
                        className="rounded bg-neutral-900 border-neutral-800 text-indigo-600 focus:ring-0"
                      />
                      <span>Save card securely for 1-click future pulse drops</span>
                    </label>
                  </div>
                )}

                {formData.paymentMethod === "klarna" && (
                  <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">4 Interest-Free Payments</span>
                      <span className="text-xs font-extrabold text-indigo-400">
                        ${installmentAmount}/mo
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Pay 25% today (${installmentAmount}) and the remaining balance over 6 weeks with zero interest or hidden fees.
                    </p>
                  </div>
                )}

                {formData.paymentMethod === "crypto" && (
                  <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-3 text-center">
                    <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mx-auto">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-white">Pay via Solana Pay / Phantom</div>
                    <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                      Scan QR code upon authorization to instantly settle USDC with sub-cent transaction fees.
                    </p>
                  </div>
                )}

                {formData.paymentMethod === "paypal" && (
                  <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-2 text-center">
                    <p className="text-xs text-neutral-300">
                      You will be redirected to PayPal to complete your authorization securely.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/35 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authorizing Secure Telemetry...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Place Order & Pay ${grandTotal.toFixed(2)}</span>
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>30-Day Money Back Guarantee • 2-Year Official Warranty</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-5 sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h3 className="text-base font-bold text-white">Order Summary</h3>
                  <span className="text-xs text-neutral-400">{cartItems.length} items</span>
                </div>

                <div className="divide-y divide-neutral-800/80 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative aspect-square w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate max-w-[170px]">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] text-neutral-400">
                            {item.selectedColor || "Default"}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-white shrink-0">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleApplyPromo} className="space-y-2 pt-2 border-t border-neutral-800">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Discount code (e.g. VIP20)"
                        className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white uppercase outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {promoMessage && (
                    <p
                      className={`text-[11px] font-medium ${
                        promoMessage.isError ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}

                  {appliedPromo && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>{appliedPromo.code} ({appliedPromo.description})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedPromo(null);
                          setPromoMessage(null);
                        }}
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
                      <div className="text-xs font-bold text-white">Full Transit Protection</div>
                      <div className="text-[11px] text-neutral-500">Covers theft, damage & delay</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeProtection}
                      onChange={(e) => setIncludeProtection(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-neutral-800">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Discount ({appliedPromo?.discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400">
                    <span>Shipping Speed</span>
                    <span className="text-white font-medium">
                      {isFreeShipping ? (
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {includeProtection && (
                    <div className="flex justify-between text-neutral-400">
                      <span>Transit Guarantee</span>
                      <span className="text-white font-medium">${protectionCost.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-400">
                    <span>Estimated Sales Tax</span>
                    <span className="text-white font-medium">${estimatedTax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-base font-black text-white pt-3 border-t border-neutral-800">
                    <span>Grand Total</span>
                    <span className="text-indigo-400">${grandTotal.toFixed(2)}</span>
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
