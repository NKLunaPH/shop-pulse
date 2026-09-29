"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Package,
  Truck,
  Heart,
  CreditCard,
  MapPin,
  Gift,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Search,
  Bell,
  SlidersHorizontal,
  RefreshCw,
  Download,
  AlertCircle,
  Award,
  Zap,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
} from "lucide-react";
import { PRODUCTS, Product } from "../../shop/data/products";
import ShopNav, { CartItem } from "../../shop/components/ShopNav";
import { api, AuthUser, OrderRecord, OrderItemPayload } from "@/lib/api";

interface Order {
  id: string;
  date: string;
  status: "In Transit" | "Delivered" | "Processing" | "Cancelled";
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  currentStep: number;
  items: {
    product: Product;
    quantity: number;
    color: string;
    price: number;
  }[];
  total: number;
  shippingAddress: string;
  paymentMethod: string;
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: "SP-984210",
    date: "Sep 28, 2026",
    status: "In Transit",
    trackingNumber: "FX-9402849102US",
    carrier: "Pulse Express 2-Day (FedEx)",
    estimatedDelivery: "Tomorrow, by 2:00 PM",
    currentStep: 3,
    items: [
      {
        product: PRODUCTS[0],
        quantity: 1,
        color: "Obsidian Black",
        price: 249,
      },
      {
        product: PRODUCTS[3],
        quantity: 1,
        color: "Matte Space Gray",
        price: 89,
      },
    ],
    total: 338.0,
    shippingAddress: "742 Evergreen Terrace, Suite 4B, San Francisco, CA 94107",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "SP-842194",
    date: "Sep 15, 2026",
    status: "Delivered",
    trackingNumber: "UPS-1Z99999999999",
    carrier: "Standard Ground (UPS)",
    estimatedDelivery: "Delivered on Sep 18, 2026",
    currentStep: 4,
    items: [
      {
        product: PRODUCTS[1],
        quantity: 1,
        color: "Space Black",
        price: 389,
      },
    ],
    total: 389.0,
    shippingAddress: "742 Evergreen Terrace, Suite 4B, San Francisco, CA 94107",
    paymentMethod: "Apple Pay",
  },
  {
    id: "SP-729103",
    date: "Aug 29, 2026",
    status: "Delivered",
    trackingNumber: "FX-8829104820US",
    carrier: "Pulse Express Overnight",
    estimatedDelivery: "Delivered on Aug 30, 2026",
    currentStep: 4,
    items: [
      {
        product: PRODUCTS[2],
        quantity: 1,
        color: "Cyber Shadow",
        price: 159,
      },
    ],
    total: 159.0,
    shippingAddress: "742 Evergreen Terrace, Suite 4B, San Francisco, CA 94107",
    paymentMethod: "Visa •••• 4242",
  },
];

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "wishlist" | "addresses" | "rewards" | "settings"
  >("overview");

  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: "Obsidian Black",
    },
  ]);

  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order>(SAMPLE_ORDERS[0]);
  const [orderSearch, setOrderSearch] = useState("");
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [user] = useState<AuthUser>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("shoppulse_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.name) {
            return {
              id: parsed.id || "user-123",
              name: parsed.name,
              email: parsed.email || "alex.rivera@example.com",
              role: parsed.role || "Shopper",
              pulsePoints: parsed.pulsePoints || 2450,
              tier: parsed.tier || "Diamond VIP",
            };
          }
        } catch {
          // Ignored
        }
      }
    }
    return {
      id: "user-123",
      name: "Alex Rivera",
      email: "alex.rivera@example.com",
      role: "Shopper",
      pulsePoints: 2450,
      tier: "Diamond VIP",
    };
  });

  const [wishlist, setWishlist] = useState<Product[]>([PRODUCTS[1], PRODUCTS[4], PRODUCTS[5]]);

  useEffect(() => {
    let isMounted = true;
    api.orders.getAll()
      .then((res) => {
        if (isMounted && res.data && res.data.length > 0) {
          const mapped: Order[] = res.data.map((o: OrderRecord, idx: number) => ({
            id: o.id || `SP-${984210 + idx}`,
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Sep 28, 2026",
            status: (o.status === "Delivered" || o.status === "Processing" || o.status === "Cancelled" ? o.status : "In Transit"),
            trackingNumber: o.trackingNumber || `FX-${Math.floor(1000000000 + Math.random() * 9000000000)}US`,
            carrier: o.carrier || "Pulse Express 2-Day (FedEx)",
            estimatedDelivery: o.status === "Delivered" ? "Delivered" : "In 2 business days",
            currentStep: o.status === "Delivered" ? 4 : o.status === "In Transit" ? 3 : 2,
            items: (o.items || []).map((item: OrderItemPayload) => ({
              product: PRODUCTS.find((p) => p.id === item.productId) || {
                ...PRODUCTS[0],
                name: item.productName || PRODUCTS[0].name,
                price: item.price || PRODUCTS[0].price,
              },
              quantity: item.quantity || 1,
              color: item.color || "Standard",
              price: item.price || 99,
            })),
            total: o.total || 0,
            shippingAddress: o.shippingAddress || "742 Evergreen Terrace, San Francisco, CA",
            paymentMethod: o.paymentMethod || "Credit Card",
          }));
          setOrders(mapped);
          setSelectedOrderForTracking(mapped[0]);
        }
      })
      .catch((err: unknown) => {
        console.warn("Using sample orders fallback:", (err as Error).message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleRemoveWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText("https://shoppulse.io/r/ALEX99");
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.items.some((i) => i.product.name.toLowerCase().includes(orderSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <ShopNav
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 space-y-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 p-0.5 shadow-xl shadow-indigo-500/20">
                  <div className="w-full h-full rounded-2xl bg-neutral-950 flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl">
                    AR
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-neutral-950 flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Alex Rivera
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" /> Diamond VIP Member
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  alex.rivera@example.com • Pulse Explorer since October 2024
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center min-w-[110px]">
                <div className="text-sm font-black text-indigo-400 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>2,450</span>
                </div>
                <div className="text-[10px] text-neutral-400">Pulse Points ($24.50)</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center min-w-[110px]">
                <div className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>1 Active</span>
                </div>
                <div className="text-[10px] text-neutral-400">Live Delivery</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-center min-w-[110px]">
                <div className="text-sm font-black text-white">
                  ${SAMPLE_ORDERS.reduce((s, o) => s + o.total, 0).toFixed(0)}
                </div>
                <div className="text-[10px] text-neutral-400">Lifetime Spent</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Overview & Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "orders"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Order History ({SAMPLE_ORDERS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "wishlist"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("rewards")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "rewards"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Pulse Rewards</span>
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "addresses"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Addresses & Cards</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "settings"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Security</span>
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Live Delivery Telemetry
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Order #{selectedOrderForTracking.id} • {selectedOrderForTracking.carrier}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                    {selectedOrderForTracking.status}
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
                    title="Download Receipt"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                <div
                  className={`p-4 rounded-2xl border space-y-1 ${
                    selectedOrderForTracking.currentStep >= 1
                      ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-300"
                      : "bg-neutral-950/40 border-neutral-850 opacity-60 text-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Order Confirmed</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">Authorized & verified</p>
                </div>

                <div
                  className={`p-4 rounded-2xl border space-y-1 ${
                    selectedOrderForTracking.currentStep >= 2
                      ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-300"
                      : "bg-neutral-950/40 border-neutral-850 opacity-60 text-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Package className="w-4 h-4 text-indigo-400" />
                    <span>Pick & Tested</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">Quality QA pass</p>
                </div>

                <div
                  className={`p-4 rounded-2xl border space-y-1 ${
                    selectedOrderForTracking.currentStep >= 3
                      ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-300 ring-1 ring-indigo-500/40"
                      : "bg-neutral-950/40 border-neutral-850 opacity-60 text-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>In Transit</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">{selectedOrderForTracking.estimatedDelivery}</p>
                </div>

                <div
                  className={`p-4 rounded-2xl border space-y-1 ${
                    selectedOrderForTracking.currentStep >= 4
                      ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-300"
                      : "bg-neutral-950/40 border-neutral-850 opacity-60 text-neutral-400"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-neutral-400" />
                    <span>Delivered</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">Signature receipt</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Shipment Contents
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedOrderForTracking.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] text-neutral-400">
                            Color: {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-400 shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-gradient-to-tr from-indigo-950/60 to-violet-950/30 border border-indigo-500/30 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-base font-bold text-white">Your VIP Loyalty Reward</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    You have <span className="font-bold text-indigo-300">2,450 Pulse Points</span> ($24.50 value) available to redeem instantly on any audio or workspace drop.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-indigo-500/20">
                  <span className="text-xs font-mono font-bold text-indigo-400">CODE: DIAMOND25</span>
                  <Link
                    href="/shop/products"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                  >
                    <span>Redeem at Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-400" />
                      <h3 className="text-base font-bold text-white">Saved Gear ({wishlist.length})</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab("wishlist")}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      View all →
                    </button>
                  </div>
                  <p className="text-xs text-neutral-400">
                    We&apos;ll notify you when items on your wishlist get price drops or pulse restocks.
                  </p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {wishlist.slice(0, 3).map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/shop/products/${prod.id}`}
                      className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 flex items-center gap-2 transition shrink-0 max-w-[200px]"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white truncate">{prod.name}</div>
                        <div className="text-[10px] text-indigo-400 font-bold">${prod.price}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID, item, tracking #..."
                  className="w-full pl-9 pr-3.5 py-2 bg-neutral-900/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                />
              </div>
              <span className="text-xs text-neutral-400">
                Showing <span className="text-white font-bold">{filteredOrders.length}</span> orders
              </span>
            </div>

            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white text-sm">{order.id}</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-neutral-400">{order.date}</span>
                      <span className="text-neutral-500">•</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === "Delivered"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-indigo-500/20 text-indigo-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="font-bold text-white text-sm">${order.total.toFixed(2)}</div>
                  </div>

                  <div className="divide-y divide-neutral-800/60">
                    {order.items.map((item, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-neutral-800"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-white">{item.product.name}</h4>
                            <p className="text-[11px] text-neutral-400">
                              Qty: {item.quantity} • {item.color}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-white">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-neutral-400">
                      Carrier: <span className="text-white font-medium">{order.carrier}</span> ({order.trackingNumber})
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrderForTracking(order);
                          setActiveTab("overview");
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold transition cursor-pointer"
                      >
                        Track Telemetry
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition cursor-pointer"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Saved Hardware & Gear ({wishlist.length})</span>
              </h2>
              <span className="text-xs text-neutral-400">Instant One-Click Cart Add</span>
            </div>

            {wishlist.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Heart className="w-10 h-10 text-neutral-600 mx-auto" />
                <h3 className="text-sm font-bold text-white">Your wishlist is empty</h3>
                <p className="text-xs text-neutral-400">
                  Save products from the catalog to get automated price pulse notifications.
                </p>
                <Link
                  href="/shop/products"
                  className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold mt-2"
                >
                  Explore Store
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="aspect-4/3 rounded-2xl overflow-hidden bg-neutral-950 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveWishlist(product.id)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-neutral-950/80 text-neutral-400 hover:text-rose-400 transition cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                          {product.category}
                        </span>
                        <h3 className="text-sm font-bold text-white truncate">{product.name}</h3>
                        <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{product.tagline}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-base font-extrabold text-white">${product.price}</div>
                        <div className="text-[10px] text-emerald-400 font-medium">In Stock</div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "rewards" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    VIP Loyalty Progression
                  </span>
                  <h3 className="text-xl font-bold text-white">Diamond Tier Explorer</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-400">2,450</span>
                  <span className="text-xs text-neutral-500 block">Available Pulse Points</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>550 points until Black Obsidian Tier (Free Next-Day Air)</span>
                  <span className="font-bold text-white">82%</span>
                </div>
                <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                  <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 w-[82%]" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Invite Friends & Earn $20 per Referral</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Give your colleagues $20 off their first order of $100+. You’ll receive 2,000 points upon their delivery confirmation.
              </p>

              <div className="flex items-center gap-2 max-w-md pt-1">
                <input
                  type="text"
                  readOnly
                  value="https://shoppulse.io/r/ALEX99"
                  className="flex-1 px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-300 font-mono select-all outline-none"
                />
                <button
                  onClick={handleCopyReferral}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  {copiedReferral ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReferral ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>Saved Shipping Addresses</span>
                </h3>
                <button className="text-xs text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3 h-3" /> Add New
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-indigo-500/30 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase">
                    Default Primary
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="text-neutral-500 hover:text-white transition">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-white">Alex Rivera</div>
                  <div className="text-neutral-400">742 Evergreen Terrace, Suite 4B</div>
                  <div className="text-neutral-400">San Francisco, CA 94107 • United States</div>
                  <div className="text-neutral-500 pt-1">+1 (555) 382-9104</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Payment Methods</span>
                </h3>
                <button className="text-xs text-indigo-400 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3 h-3" /> Add Card
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Visa ending in 4242</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    Default
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400">Expires 08/28 • Alex Rivera</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 max-w-2xl space-y-6">
            <h3 className="text-base font-bold text-white pb-3 border-b border-neutral-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Profile & Security Settings</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Display Name</label>
                <input
                  type="text"
                  defaultValue="Alex Rivera"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Email Address</label>
                <input
                  type="email"
                  defaultValue="alex.rivera@example.com"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">Password</label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                />
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Two-Factor Authentication (2FA)</div>
                  <div className="text-[11px] text-neutral-500">Secured via Authenticator App</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  Enabled
                </span>
              </div>

              <button
                type="button"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Save Profile Updates
              </button>
            </div>
          </div>
        )}
      </main>

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
