"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { STATIC_CATEGORIES } from "@/types";

const categoryImages: Record<string, string> = {
  ginger:        "https://images.unsplash.com/photo-1615485500834-bc10199bc727?q=80&w=800&auto=format&fit=crop",
  coffee:        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop",
  rosemary:      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop",
  turmeric:      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
  garlic:        "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=800&auto=format&fit=crop",
  cardamom:      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
  "black-pepper":"https://images.unsplash.com/photo-1559181567-c3190bfbd7d5?q=80&w=800&auto=format&fit=crop",
  honey:         "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800&auto=format&fit=crop",
};

const subCount: Record<string, number> = {
  ginger: 4, coffee: 4, rosemary: 3, turmeric: 3,
  garlic: 3, cardamom: 2, "black-pepper": 2, honey: 3,
};

export function CategoriesSection() {
  return (
    <section className="py-24 bg-[#F7F7F5] dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-0.5 bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-widest">
                Product Categories · <span className="font-normal normal-case opacity-75">የምርት ምድቦች</span>
              </span>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}>
              8 Agricultural Divisions
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              All available for bulk order from Ethiopia&apos;s finest agricultural product categories —
              all export-ready from Hadiya Zone.
            </p>
          </div>
          <Link href="/products"
            className="flex items-center gap-2 text-[#1B5E20] font-semibold text-sm hover:gap-3 transition-all shrink-0">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* 8-card grid: 4 large + 4 small */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATIC_CATEGORIES.map((cat, i) => {
            const isLarge = i < 4;
            return (
              <motion.div key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="group">
                <Link href={`/products/${cat.slug}`}>
                  <div className={`relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400 ${isLarge ? "h-64" : "h-48"}`}>
                    {/* Background image */}
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
                      style={{ backgroundImage: `url('${categoryImages[cat.slug]}')` }} />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-all duration-300" />

                    {/* Top: icon + count */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center text-xl">
                        {cat.icon}
                      </div>
                      <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium">
                        {subCount[cat.slug]} products
                      </span>
                    </div>

                    {/* Bottom: name */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-base leading-tight mb-0.5">
                        {cat.name}
                      </p>
                      <p className="text-[#D89C2B] text-xs font-medium mb-2">{cat.name_am}</p>
                      <div className="flex items-center gap-1.5 text-white/60 text-xs opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Explore <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
