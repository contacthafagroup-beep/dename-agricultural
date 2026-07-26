"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Award, Leaf, CheckCircle, MapPin, Package, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

const milestones = [
  { year: "2015", event: "Founded in Hosaena, Hadiya Zone, Ethiopia", icon: "🌱" },
  { year: "2017", event: "Expanded farmer network to 100+ partner farmers", icon: "👨‍🌾" },
  { year: "2019", event: "Launched coffee, rosemary & turmeric product lines", icon: "☕" },
  { year: "2021", event: "Added garlic, cardamom, black pepper & honey categories", icon: "🧄" },
  { year: "2023", event: "Expanded to serve international exporters worldwide", icon: "🌍" },
  { year: "2025", event: "Launched full B2B digital agricultural supply platform", icon: "💻" },
];

const values = [
  { icon: Award,  title: "Quality First",    desc: "Every product batch goes through rigorous inspection before leaving our facility.", color: "bg-green-50 text-[#1B5E20]" },
  { icon: Heart,  title: "Farmer Welfare",   desc: "Fair prices, training, and investment in farmer communities across Hadiya Zone.", color: "bg-amber-50 text-[#D89C2B]" },
  { icon: Leaf,   title: "Sustainability",   desc: "Eco-friendly farming practices that preserve Ethiopia's rich agricultural heritage.", color: "bg-emerald-50 text-emerald-600" },
  { icon: Users,  title: "Partnership",      desc: "Long-term relationships with exporters — trusted partners, not just suppliers.", color: "bg-blue-50 text-blue-600" },
];

const products8 = [
  { icon: "🫚", name: "Ginger",       nameAm: "ዝንጅብል" },
  { icon: "☕", name: "Coffee",       nameAm: "ቡና" },
  { icon: "🌿", name: "Rosemary",     nameAm: "ሮዝሜሪ" },
  { icon: "🟡", name: "Turmeric",     nameAm: "ቱርሜሪክ" },
  { icon: "🧄", name: "Garlic",       nameAm: "ነጭ ሽንኩርት" },
  { icon: "🌱", name: "Cardamom",     nameAm: "ኮረሪማ" },
  { icon: "⚫", name: "Black Pepper", nameAm: "ጥቁር ፍልፍል" },
  { icon: "🍯", name: "Honey",        nameAm: "ማር" },
];

export default function AboutPage() {
  return (
    <div className="pt-20">

      {/* ── HERO ── */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/80 via-[#1B5E20]/50 to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#D89C2B] to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.2em]">About Us · ስለ እኛ</span>
            </div>
            <h1 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
              Ethiopia&apos;s Premier<br />
              <span className="text-[#D89C2B]">Agricultural Supplier</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl mb-8">
              Sourcing 8 premium product categories from Hadiya Zone farms to exporters worldwide — since 2015.
            </p>
            <div className="flex flex-wrap gap-2">
              {products8.map(p => (
                <span key={p.name} className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {p.icon} {p.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-[#D89C2B]" />
                <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.18em]">Our Story</span>
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-6" style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)" }}>
                From Ethiopia&apos;s Highlands<br /><span className="text-[#1B5E20]">to the World</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                <p>Dename Agricultural Supplier was founded in Hosaena, Hadiya Zone, Ethiopia with a clear mission: to make Ethiopia&apos;s exceptional agricultural products accessible to bulk buyers and exporters. What started as a small ginger supply operation has grown into one of Ethiopia&apos;s most trusted multi-product agricultural supply company — supplying exporters and bulk buyers worldwide.</p>
                <p>Rooted in Hadiya Zone — home to some of Ethiopia&apos;s finest ginger, coffee, turmeric, rosemary, garlic, cardamom, black pepper, and honey — we recognized the vast untapped export potential of Ethiopia&apos;s diverse agricultural wealth.</p>
                <p>Today we source and supply 8 product categories directly from hundreds of partner farmers to international exporters and bulk buyers worldwide. Our office is located at Hosaena Sport Hotel, Hosaena, Ethiopia.</p>
              </div>
              <Link href="/products" className="inline-flex items-center gap-2 mt-8 text-[#1B5E20] font-semibold text-sm hover:gap-3 transition-all">
                Browse Our Products <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="grid grid-cols-2 gap-3">
              {[
                { img: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?q=80&w=800", h: "h-52", mt: "" },
                { img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800", h: "h-36", mt: "mt-10" },
                { img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800", h: "h-36", mt: "" },
                { img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800", h: "h-52", mt: "mt-10" },
              ].map((img, i) => (
                <div key={i} className={`${img.h} ${img.mt} rounded-2xl bg-cover bg-center shadow-md hover:shadow-xl transition-shadow duration-300`}
                  style={{ backgroundImage: `url('${img.img}')` }} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MISSION / VISION / PURPOSE ── */}
      <section className="py-24 bg-[#F7F7F5] dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1B5E20] via-[#D89C2B] to-[#1B5E20]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.18em]">Mission & Vision</span>
              <div className="w-8 h-[2px] bg-[#D89C2B]" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white" style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)" }}>
              What Drives Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Target, title: "Our Mission", color: "bg-[#1B5E20]", desc: "To source and supply the highest quality Ethiopian agricultural products to global exporters, while empowering local farmers and promoting sustainable agriculture across 8 product categories." },
              { icon: Eye,    title: "Our Vision",  color: "bg-[#D89C2B]", desc: "To be recognized as Africa's most trusted and sustainable agricultural supplier, transforming Ethiopian agriculture through premium multi-product export partnerships." },
              { icon: Heart,  title: "Our Purpose", color: "bg-blue-600",   desc: "Bridging the gap between Ethiopian farming communities and global markets, creating prosperity for all stakeholders across the entire agricultural supply chain." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-border hover:shadow-lg transition-all duration-300 group">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Values grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="font-bold text-gray-900 dark:text-white text-2xl">Our Core Values</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-border hover:shadow-md text-center transition-all duration-300 group">
                <div className={`w-12 h-12 ${v.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FARMER NETWORK ── */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-[#D89C2B]" />
                <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.18em]">Farmer Network · ገበሬዎቻችን</span>
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-4" style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)" }}>
                500+ Partner Farmers<br /><span className="text-[#1B5E20]">Hadiya Zone, Ethiopia</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Our farmer network spans Hadiya Zone — the heart of Ethiopia&apos;s finest
                agricultural territory. Across ginger, coffee, turmeric, rosemary, garlic,
                cardamom, honey, and pepper farms, we provide training, fair pricing, and
                technical support to ensure optimal quality.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Regular agronomist visits and crop-specific training",
                  "Fair Trade pricing above market rates for all products",
                  "Harvest timing guidance for optimal quality and yield",
                  "Direct farm-to-warehouse purchase — no middlemen",
                  "Technical support for sustainable farming practices",
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1B5E20] shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Users,  value: "500+",   label: "Farmers",    sub: "Partner network" },
                  { icon: MapPin, value: "Hadiya",  label: "Zone",       sub: "Base location" },
                  { icon: Leaf,   value: "8",       label: "Categories", sub: "Products sourced" },
                ].map(stat => (
                  <div key={stat.label}
                    className="bg-[#F7F7F5] dark:bg-gray-800 rounded-2xl p-4 text-center border border-border hover:border-[#1B5E20]/25 transition-colors">
                    <stat.icon className="w-5 h-5 text-[#1B5E20] mx-auto mb-2" />
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">{stat.label}</div>
                    <div className="text-[10px] text-muted-foreground">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl" style={{ height: 420 }}>
                <div className="w-full h-full bg-cover bg-center hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop')" }} />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-[#1B5E20] text-white rounded-2xl p-5 shadow-2xl">
                <Package className="w-6 h-6 mb-2 opacity-80" />
                <div className="text-2xl font-bold">8</div>
                <div className="text-xs text-white/75">Product<br />Categories</div>
              </div>
              <div className="absolute -top-5 -right-5 bg-[#D89C2B] text-white rounded-2xl p-5 shadow-2xl">
                <Users className="w-6 h-6 mb-2 opacity-80" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-xs text-white/75">Partner<br />Farmers</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-24 bg-[#F7F7F5] dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.18em]">Our Journey</span>
              <div className="w-8 h-[2px] bg-[#D89C2B]" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white" style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)" }}>
              Key Milestones
            </h2>
          </motion.div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#1B5E20]/10 via-[#1B5E20]/40 to-[#1B5E20]/10" />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <motion.div key={m.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>

                  {/* Card */}
                  <div className="flex-1 ml-14 md:ml-0">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 border border-border hover:border-[#1B5E20]/30 hover:shadow-lg transition-all duration-300 inline-block w-full group">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xl">{m.icon}</span>
                        <span className="text-[#D89C2B] font-bold text-lg">{m.year}</span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{m.event}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-5 h-5 rounded-full bg-[#1B5E20] border-4 border-white dark:border-gray-800 shadow-md z-10" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FACILITIES ── */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.18em]">Infrastructure</span>
              <div className="w-8 h-[2px] bg-[#D89C2B]" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white" style={{ fontSize: "clamp(1.7rem, 3vw, 2.4rem)" }}>
              World-Class Facilities
            </h2>
            <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
              Modern processing, storage, and logistics infrastructure in Hosaena, Hadiya Zone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Package, title: "Processing Facility", detail: "Hosaena, Ethiopia", color: "bg-green-50 text-[#1B5E20]", desc: "Modern sorting, cleaning, and grading facility handling all 8 product categories with HACCP-certified processes." },
              { icon: Leaf,    title: "Cold Storage",        detail: "Temperature Controlled", color: "bg-amber-50 text-[#D89C2B]", desc: "Temperature-controlled warehousing for fresh ginger, coffee, honey, and other perishable agricultural products." },
              { icon: Truck,   title: "Logistics Network",   detail: "Port of Djibouti",      color: "bg-blue-50 text-blue-600",   desc: "Refrigerated farm-to-warehouse transport with established port connections in Djibouti for global export." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                whileHover={{ y: -5 }}
                className="group bg-[#F7F7F5] dark:bg-gray-800 rounded-2xl p-7 border border-border hover:border-[#1B5E20]/25 hover:shadow-xl transition-all duration-300">
                <div className={`w-13 h-13 w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.desc}</p>
                <span className="inline-block bg-[#1B5E20]/10 text-[#1B5E20] text-xs font-semibold px-3 py-1.5 rounded-full">
                  {item.detail}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-14 gradient-primary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div>
              <h3 className="font-bold text-2xl mb-2">Ready to Source Ethiopian Agricultural Products?</h3>
              <p className="text-white/75 text-sm max-w-lg">
                Contact us today to discuss your requirements. We deliver premium quality across
                all 8 categories — ginger, coffee, rosemary, turmeric, garlic, cardamom, pepper &amp; honey.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/products"
                className="inline-flex items-center justify-center gap-2 bg-[#D89C2B] hover:bg-[#C68A1A] text-white px-7 py-3.5 rounded-xl font-semibold transition-colors text-sm whitespace-nowrap">
                Browse Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white px-7 py-3.5 rounded-xl font-semibold border border-white/30 transition-colors text-sm whitespace-nowrap">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
