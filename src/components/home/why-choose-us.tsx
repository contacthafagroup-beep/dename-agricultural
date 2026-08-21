"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Truck, Users, Award, Leaf, Clock, BarChart3, Headphones } from "lucide-react";
import Link from "next/link";

const features = [
  { icon: Shield,     title: "Quality Certified",    desc: "Every batch inspected to ISO & HACCP international export standards.",      color: "bg-green-50  text-[#1B5E20]" },
  { icon: Users,      title: "500+ Farmers",         desc: "Direct from our network of certified farmers across Hadiya Zone.",           color: "bg-amber-50  text-[#D89C2B]" },
  { icon: Truck,      title: "Export Logistics",     desc: "End-to-end logistics — farm to port with all documentation handled.",        color: "bg-blue-50   text-blue-600" },
  { icon: BarChart3,  title: "Competitive Pricing",  desc: "Direct sourcing = better prices. Volume discounts across all categories.",   color: "bg-purple-50 text-purple-600" },
  { icon: Leaf,       title: "Sustainable",          desc: "Eco-friendly practices supporting Ethiopian farming communities.",            color: "bg-emerald-50 text-emerald-600" },
  { icon: Clock,      title: "Timely Delivery",      desc: "Buffer stock maintained for urgent orders. Consistent supply year-round.",   color: "bg-orange-50 text-orange-600" },
  { icon: Award,      title: "8 Categories",         desc: "Ginger, coffee, rosemary, turmeric, garlic, cardamom, pepper & honey.",     color: "bg-rose-50   text-rose-600" },
  { icon: Headphones, title: "Dedicated Support",    desc: "Personal account manager. 24/7 via WhatsApp, phone & email.",               color: "bg-cyan-50   text-cyan-600" },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-[#F7F7F5] dark:bg-gray-800 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1B5E20]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-0.5 bg-[#D89C2B]" />
            <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-widest">Why Choose Us</span>
            <div className="w-8 h-0.5 bg-[#D89C2B]" />
          </div>
          <h2 className="font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)" }}>
            The Competitive Advantage
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Deep local knowledge, international standards, and a dedicated farmer network
            across 8 premium agricultural product categories.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-border hover:border-[#1B5E20]/25 hover:shadow-lg transition-all duration-300 group">
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000&auto=format&fit=crop')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/95 via-[#1B5E20]/85 to-[#1B5E20]/60 pointer-events-none" />

          <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white max-w-xl">
              <p className="text-[#D89C2B] text-sm font-semibold uppercase tracking-widest mb-3">
                Ready to source?
              </p>
              <h3 className="font-bold mb-3" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}>
                Are You an Exporter or Bulk Buyer?
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">
                Join exporters who trust Dename for premium Ethiopian agricultural products
                across 8 categories — receive your quotation within 24 hours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Link href="/products"
                className="inline-flex items-center justify-center gap-2 bg-[#D89C2B] hover:bg-[#C68A1A] text-white px-7 py-3.5 rounded-xl font-semibold transition-colors shadow-lg text-sm whitespace-nowrap">
                Browse Products
              </Link>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white px-7 py-3.5 rounded-xl font-semibold transition-colors border border-white/30 text-sm whitespace-nowrap backdrop-blur-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
