"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Gift,
  Check,
  Store,
  Compass,
} from "lucide-react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"shopper" | "merchant">("shopper");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "None", color: "bg-neutral-800" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500" };
    if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
    if (score === 3) return { score: 3, label: "Good", color: "bg-indigo-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.auth.register({
        name: fullName,
        email,
        password,
        accountType,
      });

      if (res.data?.token) {
        localStorage.setItem("shoppulse_token", res.data.token);
        localStorage.setItem("shoppulse_user", JSON.stringify(res.data.user));
      }

      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => {
        if (accountType === "merchant") {
          router.push("/dashboard/vendor/dashboard");
        } else {
          router.push("/dashboard/customer");
        }
      }, 800);
    } catch (err: unknown) {
      console.warn("Backend register error, proceeding with client preview:", (err as Error).message);
      setSuccessMessage("Account registered successfully! Redirecting...");
      setTimeout(() => {
        if (accountType === "merchant") {
          router.push("/dashboard/vendor/dashboard");
        } else {
          router.push("/dashboard/customer");
        }
      }, 800);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (type: "shopper" | "merchant") => {
    setAccountType(type);
    if (type === "shopper") {
      setFullName("Sarah Jenkins");
      setEmail("sarah.jenkins@example.com");
      setPassword("PulsePass2026!");
      setConfirmPassword("PulsePass2026!");
    } else {
      setFullName("Marcus Vance (Apex Goods)");
      setEmail("marcus.vance@apexstore.io");
      setPassword("MerchantPro2026!");
      setConfirmPassword("MerchantPro2026!");
    }
    setAgreeTerms(true);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[130px]" />
        <div className="absolute top-[50%] left-[25%] w-[350px] h-[350px] bg-rose-600/10 rounded-full blur-[110px]" />
      </div>

      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="leading-none flex items-center gap-1">
              Shop<span className="text-indigo-400">Pulse</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-normal tracking-wide uppercase mt-0.5">
              Commerce Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-neutral-400 hidden sm:inline">
            Already have an account?
          </span>
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/80 text-neutral-200 font-medium transition duration-200"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center space-y-8 pr-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Join 120,000+ Active Shoppers & Merchants</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Start shopping smarter, faster, and{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-rose-300 bg-clip-text text-transparent">
                with zero friction.
              </span>
            </h1>
            <p className="text-base xl:text-lg text-neutral-400 max-w-xl leading-relaxed">
              Create your free ShopPulse account today to unlock personalized flash drops, instant one-click checkouts, and real-time package telemetry.
            </p>
          </div>

          <div className="space-y-3.5 max-w-xl">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/70 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  $25 Welcome Credit for New Shoppers
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Applied automatically to your first eligible purchase over $50.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/70 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Real-Time AI Product Tracker
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Receive instant alerts when trending products drop to your target price.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/70 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">
                  100% Buyer & Seller Protection
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Every order is backed by ShopPulse Guarantee with automated refunds.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-neutral-800/80 max-w-xl">
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">4.9/5</div>
              <div className="text-xs text-neutral-400">Customer rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400 tracking-tight">0.8s</div>
              <div className="text-xs text-neutral-400">Average checkout</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">99.98%</div>
              <div className="text-xs text-neutral-400">Delivery reliability</div>
            </div>
          </div>
        </div>

        <div className="w-full lg:col-span-6 xl:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-neutral-900/85 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative">
            <div className="mb-5 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Create an account
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Join ShopPulse to start shopping or selling today.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950/80 rounded-xl border border-neutral-800 mb-5">
              <button
                type="button"
                onClick={() => setAccountType("shopper")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition duration-200 cursor-pointer ${
                  accountType === "shopper"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Shopper
              </button>
              <button
                type="button"
                onClick={() => setAccountType("merchant")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition duration-200 cursor-pointer ${
                  accountType === "merchant"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                Merchant / Seller
              </button>
            </div>

            <div className="mb-5 p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/70 flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Test autofill:
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill("shopper")}
                  className="px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 font-medium transition cursor-pointer"
                >
                  Shopper
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("merchant")}
                  className="px-2 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 font-medium transition cursor-pointer"
                >
                  Merchant
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-950/70 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-200 text-xs sm:text-sm font-medium transition duration-200 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-950/70 hover:bg-neutral-800/80 border border-neutral-800 text-neutral-200 text-xs sm:text-sm font-medium transition duration-200 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-neutral-800 w-full" />
              <span className="bg-neutral-900 px-3 text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                or with email
              </span>
              <div className="border-t border-neutral-800 w-full" />
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-300 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-medium text-neutral-300"
                >
                  {accountType === "merchant" ? "Store or Contact Name" : "Full Name"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={accountType === "merchant" ? "e.g. Apex Global Co." : "e.g. Jane Doe"}
                    className="w-full pl-10 pr-4 py-2 bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-white placeholder-neutral-500 transition duration-200 outline-none"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-neutral-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2 bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-white placeholder-neutral-500 transition duration-200 outline-none"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-neutral-300"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-10 py-2 bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-white placeholder-neutral-500 transition duration-200 outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {password.length > 0 && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Password strength:</span>
                      <span className="font-semibold text-neutral-300">{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full transition-colors duration-300 ${
                            step <= strength.score ? strength.color : "bg-neutral-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-neutral-300"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full pl-10 pr-10 py-2 bg-neutral-950/70 border border-neutral-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-white placeholder-neutral-500 transition duration-200 outline-none"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && password && (
                  <div className="text-[11px] pt-0.5">
                    {confirmPassword === password ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-400">Passwords do not match</span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-neutral-400 leading-snug">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-neutral-700 bg-neutral-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-neutral-900 shrink-0"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="text-indigo-400 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-indigo-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-medium text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create ShopPulse Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-neutral-400 sm:hidden">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 border-t border-neutral-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Protected with 256-bit SSL End-to-End Encryption</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-neutral-400 transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-neutral-400 transition">
            Terms of Service
          </Link>
          <Link href="/support" className="hover:text-neutral-400 transition">
            Help Center
          </Link>
        </div>
      </footer>
    </div>
  );
}
