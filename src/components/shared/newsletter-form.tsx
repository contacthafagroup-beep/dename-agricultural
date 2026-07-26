"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 text-green-400">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm">Thank you! You&apos;re subscribed to our newsletter.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
      <Input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-[#1B5E20]"
        required
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        className="whitespace-nowrap bg-[#1B5E20] hover:bg-[#2E7D32]"
      >
        {status === "loading" ? "..." : (
          <>Subscribe <ArrowRight className="w-4 h-4" /></>
        )}
      </Button>
    </form>
  );
}
