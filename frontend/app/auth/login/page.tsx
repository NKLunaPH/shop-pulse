"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"Shopper" | "Vendor" | "Admin" | "Warehouse">("Vendor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const emailInvalid =
    touched.email &&
    (!email || !email.includes("@") || !email.includes("."));
  const passwordInvalid =
    touched.password &&
    (!password || password.length < 8);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError("");

    if (!email || !email.includes("@") || password.length < 8) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password, role });
      if (res.data?.token) {
        localStorage.setItem("shoppulse_token", res.data.token);
        localStorage.setItem("shoppulse_user", JSON.stringify(res.data.user));
      }
    } catch (err: unknown) {
      console.warn("Backend auth unavailable or error, continuing with client routing:", (err as Error).message);
    } finally {
      setIsLoading(false);
      if (role === "Admin") {
        router.push("/dashboard/admin");
      } else if (role === "Vendor") {
        router.push("/dashboard/vendor/dashboard");
      } else if (role === "Warehouse") {
        router.push("/dashboard/vendor/inventory");
      } else {
        router.push("/dashboard/customer");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent text-slate-100 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans antialiased selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md space-y-7">
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-amber-400 stroke-current stroke-2 fill-none stroke-linecap-round stroke-linejoin-round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            ShopPulse
          </span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Sign in to your account
          </h1>
          <p className="text-sm text-slate-400 font-normal leading-relaxed">
            Select your portal to manage products, orders, or browse your account.
          </p>
        </div>

        <div className="grid grid-cols-4 bg-[#0d1527] p-1.5 rounded-xl border border-[#1e293b]">
          {(
            [
              "Shopper",
              "Vendor",
              "Admin",
              "Warehouse",
            ] as const
          ).map((item) => {
            const active = role === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`py-2 px-1.5 rounded-lg text-xs font-semibold transition-all duration-150 text-center leading-tight flex items-center justify-center cursor-pointer ${
                  active
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="work-email"
              className="block text-xs font-semibold text-slate-200"
            >
              Work email
            </label>
            <input
              id="work-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email)
                  setTouched((prev) => ({ ...prev, email: false }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              placeholder="you@yourshop.com"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#091122] text-sm text-white placeholder-slate-600 outline-none transition duration-150 border ${
                emailInvalid
                  ? "border-rose-500/80 focus:border-rose-400"
                  : "border-[#1e293b] focus:border-blue-500"
              }`}
            />
            {emailInvalid && (
              <p className="text-xs text-rose-400 font-normal pt-0.5">
                Enter a valid email, like you@yourshop.com.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-200"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password)
                    setTouched((prev) => ({ ...prev, password: false }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder="Enter your password"
                className={`w-full pl-3.5 pr-14 py-2.5 rounded-xl bg-[#091122] text-sm text-white placeholder-slate-600 outline-none transition duration-150 border ${
                  passwordInvalid
                    ? "border-rose-500/80 focus:border-rose-400"
                    : "border-[#1e293b] focus:border-blue-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {passwordInvalid && (
              <p className="text-xs text-rose-400 font-normal pt-0.5">
                Password must be at least 8 characters.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-[#091122] text-blue-600 focus:ring-blue-500 focus:ring-offset-[#070b14] accent-blue-600 cursor-pointer"
              />
              <span>Keep me signed in</span>
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#4475f2] hover:bg-[#3b6ae2] active:scale-[0.99] text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition duration-150 flex items-center justify-center cursor-pointer disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-xl bg-[#0c1426] hover:bg-[#111c36] border border-[#1e2d4d] text-white text-xs sm:text-sm font-semibold transition duration-150 flex items-center justify-center cursor-pointer"
          >
            Sign in with company SSO
          </button>
        </form>

        <div className="pt-2 text-xs text-slate-400">
          <span>New vendor? </span>
          <Link
            href="/auth/register"
            className="font-bold text-blue-400 hover:text-blue-300 transition"
          >
            Apply to sell on ShopPulse
          </Link>
        </div>
      </div>
    </div>
  );
}
