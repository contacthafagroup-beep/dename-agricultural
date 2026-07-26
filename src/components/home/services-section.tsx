"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
  { icon: "📦", title: "Bulk Supply",           desc: "1 MT to 500 MT across all 8 categories with consistent export quality." },
  { icon: "🌱", title: "Farmer Sourcing",        desc: "Direct procurement from 500+ certified Ethiopian farmers in Hadiya Zone." },
  { icon: "✨", title: "Sorting & Cleaning",     desc: "Professional sorting, cleaning, and grading to international standards." },
  { icon: "🎁", title: "Packaging",              desc: "Custom packaging — mesh bags, cartons, jute bags, drums per your spec." },
  { icon: "❄️", title: "Cold Storage",           desc: "Temperature-controlled warehousing in Hosaena for all product types." },
  { icon: "🚛", title: "Transportation",         desc: "Farm-to-port refrigerated logistics with customs clearance to Djibouti." },
  { icon: "🔍", title: "Quality Inspection",     desc: "Third-party inspection with full certificates for every shipment." },
  { icon: "📋", title: "Export Preparation",     desc: "Complete documentation — phytosanitary, CoO, packing lists, compliance." },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-[#D89C2B]" />
            <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-widest">Services</span>
            <div className="w-8 h-0.5 bg-[#D89C2B]" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white mb-3"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}>
            Complete Supply Chain Solutions
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            From farm sourcing to your warehouse — we handle every step of the
            agricultural supply chain with precision and care.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -5 }}
              className="group bg-[#F7F7F5] dark:bg-gray-800 rounded-2xl p-5 border border-border hover:border-[#1B5E20]/30 hover:shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-default">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 group-hover:text-[#1B5E20] transition-colors">
                {s.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-3 h-0.5 w-5 bg-[#D89C2B] rounded-full opacity-0 group-hover:opacity-100 group-hover:w-8 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        {/* CTA link */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-10">
          <Link href="/products"
            className="inline-flex items-center gap-2 text-[#1B5E20] font-semibold text-sm hover:gap-3 transition-all duration-200">
            Place Your Order Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
