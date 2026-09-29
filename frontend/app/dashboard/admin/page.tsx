"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Sparkles,
  Zap,
  Clock,
  Layers,
  ShoppingBag,
  CreditCard,
  Lock,
  Download,
  MoreVertical,
  Activity,
  Check,
  ChevronRight,
  Eye,
  RefreshCw,
  Award,
} from "lucide-react";
import { PRODUCTS, Product } from "../../shop/data/products";
import ShopNav, { CartItem } from "../../shop/components/ShopNav";
import { api } from "@/lib/api";

interface AdminVendor {
  id: string;
  name: string;
  category: string;
  ownerEmail: string;
  status: "Active" | "Pending Review" | "Suspended";
  gmvMonthly: number;
  commissionEarned: number;
  fulfillmentScore: number;
  productsCount: number;
  joinedDate: string;
  riskScore: "Low" | "Medium" | "High";
}

interface AdminTransaction {
  id: string;
  orderNumber: string;
  customerName: string;
  vendorName: string;
  amount: number;
  commission: number;
  date: string;
  status: "Completed" | "Processing" | "Refunded" | "Disputed";
  paymentGateway: "Stripe" | "Apple Pay" | "Solana USDC" | "PayPal";
}

const SAMPLE_ADMIN_VENDORS: AdminVendor[] = [
  {
    id: "v-01",
    name: "AuraSonic Acoustics",
    category: "Audio",
    ownerEmail: "contact@aurasonic.de",
    status: "Active",
    gmvMonthly: 284500,
    commissionEarned: 42675,
    fulfillmentScore: 99.8,
    productsCount: 14,
    joinedDate: "Jan 2024",
    riskScore: "Low",
  },
  {
    id: "v-02",
    name: "Kronos BioDynamics",
    category: "Wearables",
    ownerEmail: "founders@kronosbio.ch",
    status: "Active",
    gmvMonthly: 198400,
    commissionEarned: 29760,
    fulfillmentScore: 99.5,
    productsCount: 8,
    joinedDate: "Mar 2024",
    riskScore: "Low",
  },
  {
    id: "v-03",
    name: "ApexForge Studio",
    category: "Workspace",
    ownerEmail: "lab@apexforge.jp",
    status: "Active",
    gmvMonthly: 165200,
    commissionEarned: 24780,
    fulfillmentScore: 99.9,
    productsCount: 19,
    joinedDate: "Feb 2024",
    riskScore: "Low",
  },
  {
    id: "v-04",
    name: "ViperTactile Custom Labs",
    category: "Gaming",
    ownerEmail: "apply@vipertactile.io",
    status: "Pending Review",
    gmvMonthly: 0,
    commissionEarned: 0,
    fulfillmentScore: 94.0,
    productsCount: 4,
    joinedDate: "Just now",
    riskScore: "Medium",
  },
  {
    id: "v-05",
    name: "CyberSound Global Import",
    category: "Audio",
    ownerEmail: "disputes@cybersound.xyz",
    status: "Suspended",
    gmvMonthly: 42000,
    commissionEarned: 6300,
    fulfillmentScore: 88.2,
    productsCount: 6,
    joinedDate: "Nov 2024",
    riskScore: "High",
  },
];

const SAMPLE_TRANSACTIONS: AdminTransaction[] = [
  {
    id: "TX-9941",
    orderNumber: "SP-984210",
    customerName: "Alex Rivera",
    vendorName: "AuraSonic Acoustics",
    amount: 338.0,
    commission: 50.7,
    date: "2 mins ago",
    status: "Completed",
    paymentGateway: "Apple Pay",
  },
  {
    id: "TX-9940",
    orderNumber: "SP-984209",
    customerName: "Elena Rostova",
    vendorName: "Kronos BioDynamics",
    amount: 389.0,
    commission: 58.35,
    date: "14 mins ago",
    status: "Completed",
    paymentGateway: "Stripe",
  },
  {
    id: "TX-9939",
    orderNumber: "SP-984208",
    customerName: "Marcus Vance",
    vendorName: "ApexForge Studio",
    amount: 159.0,
    commission: 23.85,
    date: "42 mins ago",
    status: "Processing",
    paymentGateway: "Solana USDC",
  },
  {
    id: "TX-9938",
    orderNumber: "SP-984207",
    customerName: "Sarah Jenkins",
    vendorName: "Lumina Matrix Labs",
    amount: 89.0,
    commission: 13.35,
    date: "1 hour ago",
    status: "Completed",
    paymentGateway: "PayPal",
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "vendors" | "products" | "financials" | "audit"
  >("overview");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [vendors, setVendors] = useState<AdminVendor[]>(SAMPLE_ADMIN_VENDORS);
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorFilterStatus, setVendorFilterStatus] = useState<string>("All");
  const [announcementText, setAnnouncementText] = useState(
    "⚡ Flash Deal Week: Get free express 2-day shipping on all orders over $150"
  );
  const [isSavedAnnouncement, setIsSavedAnnouncement] = useState(false);

  const totalGMV = 1428950;
  const platformRevenue = 214342.5;
  const activeVendorsCount = vendors.filter((v) => v.status === "Active").length;
  const pendingVendorsCount = vendors.filter((v) => v.status === "Pending Review").length;

  const handleApproveVendor = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status: "Active" } : v))
    );
  };

  const handleSuspendVendor = (vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status: "Suspended" } : v))
    );
  };

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedAnnouncement(true);
    setTimeout(() => setIsSavedAnnouncement(false), 2000);
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesStatus =
        vendorFilterStatus === "All" || vendor.status === vendorFilterStatus;
      const matchesSearch =
        vendor.name.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        vendor.category.toLowerCase().includes(vendorSearch.toLowerCase()) ||
        vendor.ownerEmail.toLowerCase().includes(vendorSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [vendors, vendorFilterStatus, vendorSearch]);

  return (
    <div className="min-h-screen bg-transparent text-neutral-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <ShopNav
        cart={cart}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 space-y-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  ShopPulse Core Engine Online • v2.6.4
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
                  Root Admin Authority
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Marketplace Administration Command Center
              </h1>
              <p className="text-xs text-neutral-400">
                Global telemetry, merchant settlement batches, KYC verification, and product moderation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/customer"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-xl transition"
              >
                Customer Portal
              </Link>
              <Link
                href="/shop/products"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <span>Live Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold">Gross Marketplace Value</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              ${(totalGMV / 1000).toFixed(1)}k
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last month
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold">Platform Take (15% Cut)</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">
              ${(platformRevenue / 1000).toFixed(1)}k
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +22.1% net profit margin
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold">Verified Hardware Makers</span>
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {activeVendorsCount} <span className="text-xs text-neutral-500 font-normal">Active</span>
            </div>
            <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {pendingVendorsCount} pending KYC verification
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold">Live Concurrent Shoppers</span>
              <Activity className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              3,842
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> 99.99% edge response speed
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
            <Activity className="w-4 h-4" />
            <span>Telemetry & Live Stream</span>
          </button>

          <button
            onClick={() => setActiveTab("vendors")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "vendors"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Merchants & KYC ({vendors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "products"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog Moderation ({PRODUCTS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("financials")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "financials"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Settlement Batches</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "audit"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Global Shield & Banner</span>
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Live Platform Order Stream</h3>
                  </div>
                  <span className="text-[11px] text-neutral-500">Auto-refreshing (Real-time)</span>
                </div>

                <div className="divide-y divide-neutral-800">
                  {SAMPLE_TRANSACTIONS.map((tx) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{tx.orderNumber}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="text-indigo-400 font-medium">{tx.vendorName}</span>
                          <span className="text-neutral-500">•</span>
                          <span className="text-neutral-400">{tx.customerName}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Gateway: {tx.paymentGateway} • {tx.date}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-white">${tx.amount.toFixed(2)}</div>
                        <div className="text-[10px] text-emerald-400 font-medium">
                          +${tx.commission.toFixed(2)} commission
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Action Required</span>
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                    <div className="font-bold text-amber-300">1 Vendor Pending KYC Approval</div>
                    <p className="text-[11px] text-neutral-300">
                      ViperTactile Custom Labs submitted manufacturing certification docs.
                    </p>
                    <button
                      onClick={() => setActiveTab("vendors")}
                      className="text-xs text-amber-400 font-bold hover:underline pt-1 block cursor-pointer"
                    >
                      Review merchant application →
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1">
                    <div className="font-bold text-indigo-300">Weekly Payout Batch Ready</div>
                    <p className="text-[11px] text-neutral-300">
                      $184,200.00 ready for distribution across 14 verified maker nodes.
                    </p>
                    <button
                      onClick={() => setActiveTab("financials")}
                      className="text-xs text-indigo-400 font-bold hover:underline pt-1 block cursor-pointer"
                    >
                      Process settlement batch →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "vendors" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    placeholder="Search vendor, category, email..."
                    className="w-full pl-9 pr-3.5 py-2 bg-neutral-900/80 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                  />
                </div>

                <select
                  value={vendorFilterStatus}
                  onChange={(e) => setVendorFilterStatus(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <span className="text-xs text-neutral-400">
                Showing <span className="text-white font-bold">{filteredVendors.length}</span> merchants
              </span>
            </div>

            <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-5">Vendor Name & Identity</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Monthly GMV</th>
                      <th className="py-3.5 px-4">Fulfillment</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-5 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {filteredVendors.map((v) => (
                      <tr key={v.id} className="hover:bg-neutral-900/40 transition">
                        <td className="py-4 px-5">
                          <div className="font-bold text-white text-sm">{v.name}</div>
                          <div className="text-[11px] text-neutral-400">{v.ownerEmail} • Joined {v.joinedDate}</div>
                        </td>
                        <td className="py-4 px-4 text-neutral-300 font-medium">{v.category}</td>
                        <td className="py-4 px-4 font-bold text-white">${v.gmvMonthly.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <span className="text-emerald-400 font-bold">{v.fulfillmentScore}%</span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              v.status === "Active"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : v.status === "Pending Review"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          {v.status === "Pending Review" ? (
                            <button
                              onClick={() => handleApproveVendor(v.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
                            >
                              Approve KYC
                            </button>
                          ) : v.status === "Active" ? (
                            <button
                              onClick={() => handleSuspendVendor(v.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-xs transition cursor-pointer"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApproveVendor(v.id)}
                              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs transition cursor-pointer"
                            >
                              Re-activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-400" />
                <span>Marketplace Catalog Listings ({PRODUCTS.length})</span>
              </h2>
              <span className="text-xs text-neutral-400">Live Pulse Heat Scoring</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="aspect-4/3 rounded-2xl overflow-hidden bg-neutral-950 relative">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                        {prod.pulseScore} Pulse Score
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                        {prod.category}
                      </span>
                      <h3 className="text-sm font-bold text-white truncate">{prod.name}</h3>
                      <div className="text-xs font-extrabold text-white mt-1">${prod.price}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2 text-xs">
                    <span className="text-emerald-400 font-semibold">✓ Verified Listing</span>
                    <Link
                      href={`/shop/products/${prod.id}`}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "financials" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-white">Merchant Payout Settlement Batch #842</h3>
                <p className="text-xs text-neutral-400">
                  Ready to disburse via Automated Clearing House (ACH) and Solana USDC Rail.
                </p>
              </div>

              <button
                onClick={() => alert("Batch payout initiated successfully to 14 verified vendors!")}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                Disburse $184,200.00 Batch
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <span className="text-neutral-500">Gross Merchant Volume</span>
                <div className="text-xl font-black text-white mt-1">$216,705.88</div>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <span className="text-neutral-500">ShopPulse Fee Retained (15%)</span>
                <div className="text-xl font-black text-indigo-400 mt-1">$32,505.88</div>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <span className="text-neutral-500">Net Merchant Payout</span>
                <div className="text-xl font-black text-emerald-400 mt-1">$184,200.00</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 max-w-3xl space-y-6">
            <h3 className="text-base font-bold text-white pb-3 border-b border-neutral-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Live Storefront Top Announcement Bar</span>
            </h3>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  Storewide Header Announcement Text
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white outline-none"
                />
              </div>

              {isSavedAnnouncement && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Announcement banner updated and broadcasted live across all edge servers!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Broadcast Announcement
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="w-full border-t border-neutral-900 bg-neutral-950/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>© 2026 ShopPulse Commerce Inc. Administrator Portal.</span>
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
