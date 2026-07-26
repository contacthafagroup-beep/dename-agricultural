"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "", companyName: "", email: "",
    phone: "", country: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            company_name: form.companyName,
            phone: form.phone,
            country: form.country,
            role: "exporter",
          },
        },
      });
      setIsLoading(false);
      if (error) {
        console.error("Registration error:", error);
        toast.error(error.message || "Registration failed. Please try again.");
        return;
      }
      if (data?.user) {
        setSuccess(true);
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Registration catch:", err);
      toast.error("Connection error. Check your internet and try again.");
    }
  };

  if (success) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="bg-white/95 backdrop-blur dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
      <div className="w-16 h-16 bg-[#1B5E20]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-9 h-9 text-[#1B5E20]" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Account Created!</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Check your email and click the verification link to activate your account.
      </p>
      <Link href="/auth/login"><Button className="w-full">Go to Sign In</Button></Link>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-white/20 p-8">

      <div className="text-center mb-7">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        <p className="text-muted-foreground text-sm mt-1">Create an account to order products from Dename Agricultural Supplier</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</Label>
            <Input placeholder="John Doe" className="mt-1.5" value={form.fullName} onChange={e => upd("fullName", e.target.value)} required />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company *</Label>
            <Input placeholder="Company name" className="mt-1.5" value={form.companyName} onChange={e => upd("companyName", e.target.value)} required />
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address *</Label>
          <Input type="email" placeholder="your@company.com" className="mt-1.5" value={form.email} onChange={e => upd("email", e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone *</Label>
            <Input placeholder="+1 234 567 890" className="mt-1.5" value={form.phone} onChange={e => upd("phone", e.target.value)} required />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Country *</Label>
            <Input placeholder="e.g. UAE, China" className="mt-1.5" value={form.country} onChange={e => upd("country", e.target.value)} required />
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password *</Label>
          <div className="relative mt-1.5">
            <Input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
              value={form.password} onChange={e => upd("password", e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm Password *</Label>
          <Input type="password" placeholder="Repeat password" className="mt-1.5"
            value={form.confirmPassword} onChange={e => upd("confirmPassword", e.target.value)} required />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : "Create Account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#1B5E20] font-semibold hover:underline">Sign In</Link>
      </p>
    </motion.div>
  );
}
