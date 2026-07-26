"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });
    setIsLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-white/20 p-8">

      {sent ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-[#1B5E20]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-[#1B5E20]" />
          </div>
          <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Email Sent!</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Check your inbox for the password reset link.
          </p>
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center mb-7">
            <div className="w-12 h-12 bg-[#1B5E20]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-[#1B5E20]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter your email to receive reset instructions</p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
              <Input type="email" placeholder="your@company.com" className="mt-1.5"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : "Send Reset Link"}
            </Button>
            <Link href="/auth/login">
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Button>
            </Link>
          </form>
        </>
      )}
    </motion.div>
  );
}
