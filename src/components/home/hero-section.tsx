"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop",
    category: "Ethiopian Highlands",
    categoryAm: "የኢትዮጵያ ደጋ",
    line1: "Supplying Ethiopia's Finest Agricultural Products to Exporters",
  },
  {
    image: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?q=80&w=2070&auto=format&fit=crop",
    category: "Premium Ginger",
    categoryAm: "ዝንጅብል — Hadiya Zone",
    line1: "Grade A Export-Quality Fresh & Dried Ethiopian Ginger",
  },
  {
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2070&auto=format&fit=crop",
    category: "Specialty Coffee",
    categoryAm: "ቡና — Hadiya & Gibe",
    line1: "World-Class Ethiopian Specialty Arabica Coffee for Export",
  },
  {
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop",
    category: "Golden Turmeric",
    categoryAm: "ቱርሜሪክ — Ethiopia",
    line1: "High Curcumin Content Fresh & Dried Ethiopian Turmeric",
  },
  {
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=2070&auto=format&fit=crop",
    category: "Pure Ethiopian Honey",
    categoryAm: "ማር — Ethiopian Highlands",
    line1: "Rare White Honey, Forest & Organic Ethiopian Honey",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, [paused]);

  const go = (i: number) => { setCurrent((i + SLIDES.length) % SLIDES.length); setPaused(true); };
  const s = SLIDES[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100dvh", minHeight: 640, maxHeight: 920 }}>

      {/* Background slides — pointer-events-none so they never block clicks */}
      <AnimatePresence mode="sync">
        <motion.div key={`bg-${current}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${s.image}')` }} />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative accent bar — pointer-events-none */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] z-20 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #D89C2B 30%, #D89C2B 70%, transparent)" }} />

      {/* Slide tag top-right — pointer-events-none */}
      <div className="absolute top-24 right-6 sm:right-10 z-20 text-right pointer-events-none">
        <span className="block text-[#D89C2B] text-xs font-bold uppercase tracking-[0.2em] mb-0.5">{s.category}</span>
        <span className="block text-white/50 text-xs tracking-wide">{s.categoryAm}</span>
      </div>

      {/* Main content — z-30 ensures it's above all background layers */}
      <div className="absolute inset-0 z-30 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16">

          {/* Category label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-[#D89C2B]" />
            <span className="text-[#D89C2B] text-xs sm:text-sm font-semibold uppercase tracking-[0.18em]">
              {s.category}
            </span>
          </div>

          {/* Headline */}
          <div className="mb-6">
            <div className="text-white font-bold leading-[1.1] mb-2"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", letterSpacing: "-0.01em" }}>
              ኢትዮጵያ ምርቶቿን ለዓለም፤
            </div>
            <div className="text-[#D89C2B] font-bold leading-[1.1] mb-4"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", letterSpacing: "-0.01em" }}>
              ደናሜ ያቀርባል።
            </div>
            <div className="text-white/60 text-base font-medium">{s.line1}</div>
          </div>

          {/* Tagline */}
          <p className="text-[#D89C2B]/70 font-medium mb-4"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
            የኢትዮጵያ ምርጥ የግብርና ምርቶች ለዓለም ኤክስፖርተሮች
          </p>

          <p className="text-white/65 leading-relaxed max-w-xl mb-10"
            style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}>
            ጥራት ያላቸውን የኢትዮጵያ የግብርና ምርቶች ከአርሶ አደሮች በቀጥታ በማሰባሰብ
            ለኤክስፖርት ኩባንያዎች በታማኝነት፣ በጥራት እና በወቅቱ እናቀርባለን።
          </p>

          {/* CTA Buttons — plain Links, no nested button elements */}
          <div className="flex flex-wrap gap-3 mb-12">
            <Link href="/products"
              className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold rounded-xl transition-colors shadow-xl shadow-[#1B5E20]/40"
              style={{ padding: "0.85rem 1.8rem", fontSize: "0.95rem" }}>
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 bg-white/12 hover:bg-white/22 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-colors"
              style={{ padding: "0.85rem 1.8rem", fontSize: "0.95rem" }}>
              Request Quote
            </Link>
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium rounded-xl transition-colors"
              style={{ padding: "0.85rem 1.2rem", fontSize: "0.9rem" }}>
              Register as a Buyer →
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center gap-5">
            {["Order Directly From Us", "Export-Ready Stock", "500+ Partner Farmers", "Hadiya Zone, Ethiopia"].map(t => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D89C2B]" />
                <span className="text-white/55 text-xs sm:text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide navigation — bottom center — z-40 above content */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4">
        <button onClick={() => go(current - 1)}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-105">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-8 h-2 bg-[#D89C2B]" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`} />
          ))}
        </div>
        <button onClick={() => go(current + 1)}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-105">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide counter — bottom right */}
      <div className="absolute bottom-10 right-6 sm:right-10 z-40 text-right hidden sm:block pointer-events-none">
        <span className="text-white font-bold tabular-nums" style={{ fontSize: "1.4rem" }}>
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="text-white/30 mx-1.5 text-lg">/</span>
        <span className="text-white/40 tabular-nums" style={{ fontSize: "0.95rem" }}>
          {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-6 sm:left-10 z-40 hidden md:flex items-center gap-2 pointer-events-none">
        <div className="w-[1px] h-10 bg-gradient-to-b from-white/60 to-transparent" />
        <span className="text-white/35 text-[10px] uppercase tracking-[0.2em] rotate-90 origin-left ml-2">Scroll</span>
      </div>
    </section>
  );
}
