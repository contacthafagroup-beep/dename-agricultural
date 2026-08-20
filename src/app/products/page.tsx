"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight, Package, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

const subProducts: Record<string, string[]> = {
  ginger:        ["Fresh Harvested", "Fresh Washed", "Fresh Dried", "Washed Dried"],
  coffee:        ["Hadiya Coffee", "Gibe Coffee", "Green Coffee Beans", "Specialty Arabica"],
  rosemary:      ["Fresh Rosemary", "Dried Rosemary", "Rosemary Leaves"],
  turmeric:      ["Fresh Turmeric", "Dry Turmeric", "Turmeric Fingers"],
  garlic:        ["Fresh Garlic", "Peeled Garlic", "Dried Garlic"],
  cardamom:      ["Whole Cardamom", "Dried Cardamom"],
  "black-pepper":["Whole Black Pepper", "Ground Black Pepper"],
  honey:         ["White Honey", "Forest Honey", "Organic Honey"],
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const filtered = STATIC_CATEGORIES.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.name_am ?? "").includes(search) ||
    subProducts[c.slug]?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-20">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 420 }}>
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/80 via-[#1B5E20]/50 to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#D89C2B] to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.2em]">
                All Products · ሁሉም ምርቶች
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-bold text-white leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              8 Agricultural<br />
              <span className="text-[#D89C2B]">Product Categories</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-white/70 max-w-lg text-base">
              Premium B2B supply across Ethiopia&apos;s finest agricultural products —
              all export-ready from Hadiya Zone farms.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4 shrink-0">
            {[
              { num: "8",    label: "Categories" },
              { num: "30+",  label: "Sub-Products" },
              { num: "500+", label: "Partner Farmers" },
              { num: "45+",  label: "Clients Served" },
            ].map(s => (
              <div key={s.label}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-5 py-4 text-center">
                <div className="text-2xl font-bold text-[#D89C2B]">{s.num}</div>
                <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SEARCH ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-border sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products, categories…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 h-11" />
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">
            <span className="font-semibold text-[#1B5E20]">{filtered.length}</span> categories
          </p>
          {search && (
            <button onClick={() => setSearch("")}
              className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 bg-muted rounded-lg transition-colors">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── CATEGORY GRID ── */}
      <section className="py-16 bg-[#F7F7F5] dark:bg-gray-800 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No results found</h3>
              <p className="text-muted-foreground text-sm">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((cat, i) => (
                <motion.div key={cat.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  whileHover={{ y: -6 }}
                  className="group">
                  <Link href={`/products/${cat.slug}`}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-400">

                      {/* Image */}
                      <div className="relative h-56 overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url('${categoryImages[cat.slug]}')` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                        {/* Top badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur border border-white/25 flex items-center justify-center text-2xl shadow-sm">
                            {cat.icon}
                          </div>
                          <span className="bg-black/50 backdrop-blur text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                            {subProducts[cat.slug]?.length ?? 0} products
                          </span>
                        </div>

                        {/* Bottom: name */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-bold text-lg leading-tight">{cat.name}</p>
                          <p className="text-[#D89C2B] text-sm font-medium">{cat.name_am}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">
                          {cat.description}
                        </p>

                        {/* Sub-product pills */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {subProducts[cat.slug]?.slice(0, 3).map(s => (
                            <span key={s}
                              className="text-[10px] bg-[#1B5E20]/8 text-[#1B5E20] font-medium px-2.5 py-1 rounded-full border border-[#1B5E20]/12">
                              {s}
                            </span>
                          ))}
                          {(subProducts[cat.slug]?.length ?? 0) > 3 && (
                            <span className="text-[10px] bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                              +{(subProducts[cat.slug]?.length ?? 0) - 3}
                            </span>
                          )}
                        </div>

                        {/* CTA row */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="flex items-center gap-1 text-[#1B5E20] text-xs font-semibold group-hover:gap-2 transition-all duration-200">
                            Explore <ArrowRight className="w-3 h-3" />
                          </span>
                          <Button size="sm" className="h-8 text-xs">
                            Request Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottom info strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-16 bg-white dark:bg-gray-900 rounded-2xl border border-border p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#1B5E20]/10 flex items-center justify-center shrink-0">
              <Leaf className="w-7 h-7 text-[#1B5E20]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="font-bold text-gray-900 dark:text-white mb-1">
                Can&apos;t find what you need?
              </p>
              <p className="text-sm text-muted-foreground">
                We source custom agricultural products on request. Contact us to discuss your specific requirements —
                sesame, avocado, moringa, chili, pulses, and more available on enquiry.
              </p>
            </div>
            <Button asChild className="whitespace-nowrap">
              <Link href="/contact">Contact Us <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
