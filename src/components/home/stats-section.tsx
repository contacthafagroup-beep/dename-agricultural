"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const pillars = [
  {
    am: "ከማሳ እርሶ እስካሉበት",
    en: "Farm to Port",
    detail: "End-to-end supply chain management across all 8 product categories.",
    icon: "🌿",
    num: "8",
    numLabel: "categories",
  },
  {
    am: "ቅድሚያ ለጥራት",
    en: "Quality First",
    detail: "Every product inspected to ISO & HACCP international export standards.",
    icon: "✨",
    num: "100%",
    numLabel: "certified",
  },
  {
    am: "ገበሬዎቻችን ኩራታችን",
    en: "Farmers Are Our Pride",
    detail: "500+ partner farmers across ginger, coffee, turmeric, honey & more.",
    icon: "👨‍🌾",
    num: "500+",
    numLabel: "farmers",
  },
  {
    am: "ከኢትዮጵያ ወደ ዓለም ገበያ",
    en: "World's Agri Source",
    detail: "Ginger · Coffee · Rosemary · Turmeric · Garlic · Cardamom · Pepper · Honey",
    icon: "🌍",
    num: "45+",
    numLabel: "exporters",
  },
];

export function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-white dark:bg-gray-900">

      {/* ── Top decorative stripe ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1B5E20] via-[#D89C2B] to-[#1B5E20]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">

          {/* ── LEFT — Brand statement (2 of 5 cols) ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65 }}
            className="lg:col-span-2"
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.2em]">
                Dename Agricultural Supplier
              </span>
            </div>

            {/* Amharic headline */}
            <h2 className="font-bold text-[#1B5E20] dark:text-white leading-tight mb-3"
              style={{ fontSize: "clamp(1.7rem, 3vw, 2.5rem)" }}>
              የኢትዮጵያ ምርጥ<br />
              <span className="text-gray-800 dark:text-gray-200">የግብርና ምርቶች</span><br />
              <span className="text-[#D89C2B]">አቅራቢ</span>
            </h2>

            {/* English sub */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
              Ethiopia&apos;s Premier Agricultural Supplier — sourcing 8 premium product
              categories directly from Hadiya Zone farms for bulk buyers and exporters.
            </p>

            {/* 8 product pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { icon: "🫚", name: "Ginger" },
                { icon: "☕", name: "Coffee" },
                { icon: "🌿", name: "Rosemary" },
                { icon: "🟡", name: "Turmeric" },
                { icon: "🧄", name: "Garlic" },
                { icon: "🌱", name: "Cardamom" },
                { icon: "⚫", name: "Pepper" },
                { icon: "🍯", name: "Honey" },
              ].map((p, i) => (
                <motion.span key={p.name}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                  className="inline-flex items-center gap-1.5 bg-[#F7F7F5] dark:bg-gray-800 border border-border text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full">
                  {p.icon} {p.name}
                </motion.span>
              ))}
            </div>

            {/* Amharic quote */}
            <div className="border-l-[3px] border-[#D89C2B] pl-4 py-1">
              <p className="text-[#1B5E20] dark:text-white font-bold text-base italic">
                &ldquo;ኢትዮጵያ ምርቶቿ ለዓለም — ደናሜ ያቀርባል&rdquo;
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Ethiopia&apos;s finest products for the world — Dename delivers.
              </p>
            </div>
          </motion.div>

          {/* ── RIGHT — 4 pillar cards (3 of 5 cols) ── */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            {pillars.map((p, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative bg-[#F7F7F5] dark:bg-gray-800 rounded-2xl p-6 border border-transparent hover:border-[#1B5E20]/25 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-default"
              >
                {/* Subtle background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B5E20]/0 to-[#1B5E20]/0 group-hover:from-[#1B5E20]/4 group-hover:to-[#D89C2B]/4 transition-all duration-400 rounded-2xl pointer-events-none" />

                {/* Top row: icon + number */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <span className="text-3xl">{p.icon}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#1B5E20] dark:text-white leading-none">
                      {p.num}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {p.numLabel}
                    </div>
                  </div>
                </div>

                {/* Amharic name */}
                <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-0.5 relative z-10">
                  {p.am}
                </p>

                {/* English label */}
                <p className="text-[#D89C2B] text-[10px] font-bold uppercase tracking-wider mb-2 relative z-10">
                  {p.en}
                </p>

                {/* Detail text */}
                <p className="text-muted-foreground text-xs leading-relaxed relative z-10">
                  {p.detail}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1B5E20]/0 via-[#D89C2B]/60 to-[#1B5E20]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom decorative stripe ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
