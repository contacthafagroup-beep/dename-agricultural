"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // If already logged in, redirect away
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/dashboard");
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Sign in failed. Check your credentials.");
        setIsLoading(false);
        return;
      }

      // Store session in browser cookies
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (sessionError) {
        toast.error("Session error. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Signed in successfully! · ስኬታማ ግቤት");

      // Redirect based on role
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      toast.error("Connection error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sign in to order agricultural products
        </p>
        <p className="text-xs text-[#D89C2B] font-medium mt-1">ይግቡ</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <Label
            htmlFor="email"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@company.com"
            className="mt-1.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[#1B5E20] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Signing in…
            </>
          ) : (
            "Sign In · ይግቡ"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-[#1B5E20] font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>

      <div className="mt-4 p-3 bg-[#1B5E20]/5 rounded-xl text-center">
        <p className="text-xs text-muted-foreground">
          For exporters and bulk buyers only.{" "}
          <Link href="/contact" className="text-[#1B5E20] hover:underline">
            Contact us
          </Link>{" "}
          for access.
        </p>
      </div>
    </motion.div>
  );
}
