"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const supabase = createClient();

  // If already logged in, redirect away
  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        window.location.href = "/dashboard";
      } else {
        setChecking(false);
      }
    }
    check();
  }, []);

  const upd = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) { toast.error("Full name is required"); return; }
    if (!form.companyName.trim()) { toast.error("Company name is required"); return; }
    if (!form.email.trim()) { toast.error("Email is required"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          fullName: form.fullName.trim(),
          companyName: form.companyName.trim(),
          phone: form.phone.trim(),
          country: form.country.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      if (data.auto_login && data.access_token && data.refresh_token) {
        // Set session in singleton browser client — fires onAuthStateChange in navbar
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });

        if (sessionError) {
          console.error("setSession error:", sessionError.message);
          toast.success("Account created! Please sign in.");
          window.location.href = "/auth/login";
          return;
        }

        toast.success("Welcome to Dename! ወደ ዴናሜ እንኳን ደህና መጡ!");
        // Hard navigation — forces full page reload with session cookies set
        window.location.href = "/dashboard";
      } else {
        // Auto-login failed but user was created
        toast.success("Account created! Please sign in. · ሂሳቡ ተከፈተ! ይግቡ።");
        window.location.href = "/auth/login";
      }
    } catch {
      toast.error("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-[#1B5E20]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8"
    >
      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Register to order products from Dename Agricultural Supplier
        </p>
        <p className="text-xs text-[#D89C2B] font-medium mt-1">
          ለትዕዛዝ ሂሳብ ይክፈቱ
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full Name *
            </Label>
            <Input
              placeholder="John Doe"
              className="mt-1.5"
              value={form.fullName}
              onChange={(e) => upd("fullName", e.target.value)}
              required
              autoComplete="name"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company *
            </Label>
            <Input
              placeholder="Company name"
              className="mt-1.5"
              value={form.companyName}
              onChange={(e) => upd("companyName", e.target.value)}
              required
              autoComplete="organization"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email Address *
          </Label>
          <Input
            type="email"
            placeholder="your@company.com"
            className="mt-1.5"
            value={form.email}
            onChange={(e) => upd("email", e.target.value)}
            required
            autoComplete="username"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Phone
            </Label>
            <Input
              placeholder="+1 234 567 890"
              className="mt-1.5"
              value={form.phone}
              onChange={(e) => upd("phone", e.target.value)}
              autoComplete="tel"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Country
            </Label>
            <Input
              placeholder="e.g. UAE, China, USA"
              className="mt-1.5"
              value={form.country}
              onChange={(e) => upd("country", e.target.value)}
              autoComplete="country-name"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Password *
          </Label>
          <div className="relative mt-1.5">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => upd("password", e.target.value)}
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Confirm Password *
          </Label>
          <div className="relative mt-1.5">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={(e) => upd("confirmPassword", e.target.value)}
              required
              autoComplete="new-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Creating account…
            </>
          ) : (
            "Create Account · ሂሳብ ይክፈቱ"
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#1B5E20] font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </motion.div>
  );
}
