"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const buyerCategories = [
  {
    icon: "🌍",
    title: "International Export Companies",
    titleAm: "ዓለም አቀፍ ወደ ውጭ ላኪ ኩባንያዎች",
    desc: "Export companies that purchase Ethiopian agricultural products in bulk and ship them to Europe, Asia, the Middle East, and beyond.",
    products: ["Ginger", "Coffee", "Turmeric", "Rosemary"],
    color: "border-[#1B5E20]/25 hover:border-[#1B5E20]/50",
    badge: "bg-[#1B5E20]/10 text-[#1B5E20]",
  },
  {
    icon: "🏭",
    title: "Food Processing Companies",
    titleAm: "የምግብ ማቀነባበሪያ ኩባንያዎች",
    desc: "Food manufacturers and processors who need raw agricultural materials — spices, herbs, and natural ingredients in large quantities.",
    products: ["Black Pepper", "Cardamom", "Garlic", "Turmeric"],
    color: "border-[#D89C2B]/25 hover:border-[#D89C2B]/50",
    badge: "bg-[#D89C2B]/10 text-[#D89C2B]",
  },
  {
    icon: "🧴",
    title: "Spice & Herbal Traders",
    titleAm: "የቅመማ ቅመምና ዕፅዋት ነጋዴዎች",
    desc: "Wholesale spice traders and herbal product distributors who source directly from Ethiopia for resale in regional and global markets.",
    products: ["Rosemary", "Cardamom", "Black Pepper", "Ginger"],
    color: "border-blue-200 hover:border-blue-400",
    badge: "bg-blue-50 text-blue-600",
  },
  {
    icon: "☕",
    title: "Coffee Roasters & Buyers",
    titleAm: "የቡና አምራቾችና ገዢዎች",
    desc: "Specialty and commercial coffee roasters, green coffee buyers, and café chains sourcing authentic Ethiopian Arabica direct from origin.",
    products: ["Hadiya Coffee", "Gibe Coffee", "Specialty Arabica", "Green Beans"],
    color: "border-amber-200 hover:border-amber-400",
    badge: "bg-amber-50 text-amber-700",
  },
  {
    icon: "🍯",
    title: "Natural & Organic Products Buyers",
    titleAm: "የተፈጥሮ ምርቶች ገዢዎች",
    desc: "Companies sourcing organic and natural products — honey, herbs, and certified organic spices for health, wellness, and premium food markets.",
    products: ["White Honey", "Forest Honey", "Organic Honey", "Rosemary"],
    color: "border-emerald-200 hover:border-emerald-400",
    badge: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: "🌾",
    title: "Agricultural Trading Companies",
    titleAm: "የግብርና ምርት ንግድ ኩባንያዎች",
    desc: "Bulk agricultural commodity traders and importers who need reliable, consistent supply of quality-graded Ethiopian products at competitive prices.",
    products: ["All 8 Categories", "Custom Grades", "Bulk Volumes"],
    color: "border-purple-200 hover:border-purple-400",
    badge: "bg-purple-50 text-purple-600",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#F7F7F5] dark:bg-gray-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1B5E20] via-[#D89C2B] to-[#1B5E20]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-[2px] bg-[#D89C2B]" />
            <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-widest">
              Who We Supply · እነማን ነን የምናቀርብላቸው
            </span>
            <div className="w-8 h-[2px] bg-[#D89C2B]" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}>
            Built for Exporters &amp; Bulk Buyers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
            Dename Agricultural Supplier sources premium Ethiopian products directly from farmers
            and supplies them to exporters, food processors, traders, and bulk buyers worldwide.
            <span className="block mt-1 text-[#1B5E20] font-medium">
              ደናሜ ምርቶቹን ከአርሶ አደሮች ሰብስቦ ለወደ ውጭ ላኪዎችና ጅምላ ገዢዎች ያቀርባል።
            </span>
          </p>
        </motion.div>

        {/* Buyer category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {buyerCategories.map((cat, i) => (
            <motion.div key={cat.title}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`bg-white dark:bg-gray-900 rounded-2xl p-6 border-2 ${cat.color} transition-all duration-300 group hover:shadow-lg`}>

              <div className="text-4xl mb-4">{cat.icon}</div>

              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-0.5">{cat.title}</h3>
              <p className="text-[#D89C2B] text-xs font-medium mb-3">{cat.titleAm}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cat.desc}</p>

              {/* Product pills */}
              <div className="flex flex-wrap gap-1.5">
                {cat.products.map(p => (
                  <span key={p} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${cat.badge}`}>
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { num: "8",    label: "Product Categories",   sub: "ምርት ምድቦች" },
            { num: "500+", label: "Partner Farmers",       sub: "ሥራ አጋር ገበሬዎች" },
            { num: "30+",  label: "Sub-Products",          sub: "ንዑስ ምርቶች" },
            { num: "100%", label: "Export-Ready Supply",   sub: "ዝግጁ አቅርቦት" },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-border text-center hover:border-[#1B5E20]/30 hover:shadow-md transition-all">
              <p className="text-3xl font-bold text-[#1B5E20] mb-1">{s.num}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.label}</p>
              <p className="text-[10px] text-[#D89C2B] font-medium mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/95 via-[#1B5E20]/85 to-[#1B5E20]/70 pointer-events-none" />
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-[#D89C2B]" />
                <span className="text-[#D89C2B] text-sm font-semibold uppercase tracking-widest">
                  Are you an exporter or bulk buyer?
                </span>
              </div>
              <h3 className="font-bold mb-2" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
                We Supply Directly to You
              </h3>
              <p className="text-white/75 text-sm max-w-lg">
                Browse our 8 product categories, request an order or quotation, and our team
                will respond within 24 hours with pricing and availability.
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
          </div>
        </motion.div>

      </div>
    </section>
  );
}
