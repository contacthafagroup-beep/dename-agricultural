"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 2500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-white/20 p-8">

      {done ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-[#1B5E20]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-[#1B5E20]" />
          </div>
          <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">Password Updated!</h3>
          <p className="text-sm text-muted-foreground">Redirecting to your dashboard…</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-7">
            <div className="w-12 h-12 bg-[#1B5E20]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-[#1B5E20]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h1>
            <p className="text-muted-foreground text-sm mt-1">Choose a strong password for your account</p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</Label>
              <div className="relative mt-1.5">
                <Input type={show ? "text" : "password"} placeholder="Min. 8 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm Password</Label>
              <Input type="password" placeholder="Repeat password" className="mt-1.5"
                value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</> : "Update Password"}
            </Button>
          </form>
        </>
      )}
    </motion.div>
  );
}
