"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// ALL text sizes are fixed (not clamp/dynamic) so every slide looks identical
const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop",
    category: "Ethiopian Highlands",
    categoryAm: "የኢትዮጵያ ደጋ",
    line1: "Supplying Ethiopia's",
    line2: "Finest Agricultural",
    line3: "Products to Exporters",
    sub: "Premium B2B supply from Hadiya Zone farms — ginger, coffee, rosemary, turmeric, garlic, cardamom, honey & more.",
  },
  {
    image: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?q=80&w=2070&auto=format&fit=crop",
    category: "Premium Ginger",
    categoryAm: "ዝንጅብል — Hadiya Zone",
    line1: "Grade A Export-Quality",
    line2: "Fresh & Dried",
    line3: "Ethiopian Ginger",
    sub: "Fresh harvested, fresh washed, fresh dried, and washed dried — direct from Hadiya Zone partner farms.",
  },
  {
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2070&auto=format&fit=crop",
    category: "Specialty Coffee",
    categoryAm: "ቡና — Hadiya & Gibe",
    line1: "World-Class Ethiopian",
    line2: "Specialty Arabica",
    line3: "Coffee for Export",
    sub: "Hadiya and Gibe origin coffees — commercial grade, specialty grade Q2 (85+), and green coffee beans.",
  },
  {
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop",
    category: "Golden Turmeric",
    categoryAm: "ቱርሜሪክ — Ethiopia",
    line1: "High Curcumin Content",
    line2: "Fresh & Dried",
    line3: "Ethiopian Turmeric",
    sub: "4–5% curcumin content turmeric from Ethiopian highland farms. Fresh, dried, and finger export grades.",
  },
  {
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=2070&auto=format&fit=crop",
    category: "Pure Ethiopian Honey",
    categoryAm: "ማር — Ethiopian Highlands",
    line1: "Rare White Honey",
    line2: "Forest & Organic",
    line3: "Ethiopian Honey",
    sub: "White honey, forest honey, and certified organic honey from Ethiopian highland beehives. EU export ready.",
  },
];

// Variants — uniform, no per-slide sizing
const textVariants = {
  enter: { opacity: 0, y: 22 },
  show:  { opacity: 1, y: 0,  transition: { duration: 0.55, ease: "easeOut" as const } },
  exit:  { opacity: 0, y: -14, transition: { duration: 0.35, ease: "easeIn" as const } },
};

const tagVariants = {
  enter: { opacity: 0, x: -18 },
  show:  { opacity: 1, x: 0,   transition: { duration: 0.45, ease: "easeOut" as const } },
  exit:  { opacity: 0, x: 18,  transition: { duration: 0.28, ease: "easeIn" as const } },
};

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

      {/* ── Background slides ── */}
      <AnimatePresence mode="sync">
        <motion.div key={`bg-${current}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${s.image}')` }} />
          {/* Multi-layer overlays for depth and readability */}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
        </motion.div>
      </AnimatePresence>

      {/* ── Left accent bar ── */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] z-20"
        style={{ background: "linear-gradient(to bottom, transparent, #D89C2B 30%, #D89C2B 70%, transparent)" }} />

      {/* ── Top right: slide tag ── */}
      <div className="absolute top-24 right-6 sm:right-10 z-20 text-right">
        <AnimatePresence mode="wait">
          <motion.div key={`tag-${current}`} variants={tagVariants} initial="enter" animate="show" exit="exit">
            <span className="block text-[#D89C2B] text-xs font-bold uppercase tracking-[0.2em] mb-0.5">
              {s.category}
            </span>
            <span className="block text-white/50 text-xs tracking-wide">{s.categoryAm}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16">

          {/* Category label — top of text block */}
          <AnimatePresence mode="wait">
            <motion.div key={`label-${current}`} variants={tagVariants} initial="enter" animate="show" exit="exit"
              className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs sm:text-sm font-semibold uppercase tracking-[0.18em]">
                {s.category}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* ── Headline — FIXED 3 lines, always same size ── */}
          <div className="mb-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={`headline-${current}`} variants={textVariants} initial="enter" animate="show" exit="exit">
                {/* Line 1 */}
                {/* Main Amharic headline — fixed, same on every slide */}
                <div className="text-white font-bold leading-[1.1] mb-2"
                  style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", letterSpacing: "-0.01em" }}>
                  ኢትዮጵያ ምርቶቿን ለዓለም፤
                </div>
                <div className="text-[#D89C2B] font-bold leading-[1.1] mb-4"
                  style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", letterSpacing: "-0.01em" }}>
                  ደናሜ ያቀርባል።
                </div>
                {/* Slide-specific product label */}
                <div className="text-white/60 text-base font-medium mb-1">
                  {s.line1} {s.line2} {s.line3}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Amharic tagline — FIXED, always same size ── */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[#D89C2B]/70 font-medium mb-5"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}>
            የኢትዮጵያ ምርጥ የግብርና ምርቶች ለዓለም ኤክስፖርተሮች
          </motion.p>

          {/* ── Sub text — fixed Amharic subtitle, same always ── */}
          <AnimatePresence mode="wait">
            <motion.p key={`sub-${current}`} variants={textVariants} initial="enter" animate="show" exit="exit"
              className="text-white/65 leading-relaxed max-w-xl mb-10"
              style={{ fontSize: "clamp(0.9rem, 1.5vw, 1rem)" }}>
              ጥራት ያላቸውን የኢትዮጵያ የግብርና ምርቶች ከአርሶ አደሮች በቀጥታ በማሰባሰብ
              ለኤክስፖርት ኩባንያዎች በታማኝነት፣ በጥራት እና በወቅቱ እናቀርባለን።
            </motion.p>
          </AnimatePresence>

          {/* ── CTA Buttons ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55 }}
            className="flex flex-wrap gap-3 mb-12">
            <Link href="/products">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-semibold rounded-xl transition-colors shadow-xl shadow-[#1B5E20]/40"
                style={{ padding: "0.85rem 1.8rem", fontSize: "0.95rem" }}>
                Browse Products <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-white/12 hover:bg-white/22 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-colors"
                style={{ padding: "0.85rem 1.8rem", fontSize: "0.95rem" }}>
                Request Quote
              </motion.button>
            </Link>
            <Link href="/auth/register">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-medium rounded-xl transition-colors"
                style={{ padding: "0.85rem 1.2rem", fontSize: "0.9rem" }}>
                Register as a Buyer →
              </motion.button>
            </Link>
          </motion.div>

          {/* ── Trust strip ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap items-center gap-5">
            {["Order Directly From Us", "Export-Ready Stock", "500\+ Partner Farmers", "Hadiya Zone, Ethiopia"].map(t => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D89C2B]" />
                <span className="text-white/55 text-xs sm:text-sm">{t}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Slide navigation — bottom center ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button onClick={() => go(current - 1)}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-105">
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className={`rounded-full transition-all duration-400 ${i === current ? "w-8 h-2 bg-[#D89C2B]" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`} />
          ))}
        </div>

        <button onClick={() => go(current + 1)}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-105">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Slide counter — bottom right ── */}
      <div className="absolute bottom-10 right-6 sm:right-10 z-20 text-right hidden sm:block">
        <span className="text-white font-bold tabular-nums" style={{ fontSize: "1.4rem" }}>
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="text-white/30 mx-1.5 text-lg">/</span>
        <span className="text-white/40 tabular-nums" style={{ fontSize: "0.95rem" }}>
          {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Vertical scroll hint — bottom center-left ── */}
      <div className="absolute bottom-10 left-6 sm:left-10 z-20 hidden md:flex items-center gap-2">
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}
          className="w-[1px] h-10 bg-gradient-to-b from-white/60 to-transparent" />
        <span className="text-white/35 text-[10px] uppercase tracking-[0.2em] rotate-90 origin-left ml-2">Scroll</span>
      </div>
    </section>
  );
}
