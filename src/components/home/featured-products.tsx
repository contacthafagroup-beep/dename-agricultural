"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusLabel } from "@/lib/utils";

type ProductStatus = "available" | "limited" | "sold_out";

interface FeaturedProduct {
  id: string; name: string; nameAm: string;
  categorySlug: string; categoryIcon: string; categoryLabel: string;
  grade: string; origin: string; available_quantity: number; unit: string;
  status: ProductStatus; image: string; highlight: string;
}

const products: FeaturedProduct[] = [
  { id: "g2", name: "Fresh Washed Ginger", nameAm: "ትኩስ የታጠበ ዝንጅብል", categorySlug: "ginger", categoryIcon: "🫚", categoryLabel: "Ginger", grade: "Grade A Export", origin: "Hadiya Zone", available_quantity: 150, unit: "MT", status: "available", image: "https://images.unsplash.com/photo-1573789960-0900a3bcd80a?q=80&w=800&auto=format&fit=crop", highlight: "Moisture 83%" },
  { id: "c4", name: "Specialty Arabica Coffee", nameAm: "ልዩ አረቢካ ቡና", categorySlug: "coffee", categoryIcon: "☕", categoryLabel: "Coffee", grade: "Specialty Grade Q2 (85+)", origin: "Hadiya / Gibe", available_quantity: 20, unit: "MT", status: "limited", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop", highlight: "Cup score 85+" },
  { id: "t2", name: "Dry Turmeric", nameAm: "ደረቅ ቱርሜሪክ", categorySlug: "turmeric", categoryIcon: "🟡", categoryLabel: "Turmeric", grade: "Grade A Dried", origin: "Hadiya Zone", available_quantity: 45, unit: "MT", status: "available", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop", highlight: "4–5% curcumin" },
  { id: "h1", name: "White Honey", nameAm: "ነጭ ማር", categorySlug: "honey", categoryIcon: "🍯", categoryLabel: "Honey", grade: "Premium Export Grade", origin: "Ethiopian Highlands", available_quantity: 20, unit: "MT", status: "limited", image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800&auto=format&fit=crop", highlight: "Rare highland variety" },
];

export function FeaturedProducts() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-0.5 bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-widest">
                Featured Products · <span className="font-normal normal-case opacity-75">ተመራጭ ምርቶች</span>
              </span>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
              Available for Order Now
            </h2>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="/products">All Products <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-400">

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-600 group-hover:scale-110 pointer-events-none"
                  style={{ backgroundImage: `url('${p.image}')` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                {/* Status */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}>
                    {getStatusLabel(p.status)}
                  </span>
                </div>
                {/* Category */}
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1.5 bg-[#1B5E20]/90 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {p.categoryIcon} {p.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-[#1B5E20] transition-colors mb-0.5">
                  {p.name}
                </h3>
                <p className="text-[#D89C2B] text-xs font-medium mb-3">{p.nameAm}</p>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Package className="w-3 h-3 text-[#1B5E20]" /> {p.grade}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 text-[#1B5E20]" /> {p.origin}
                  </div>
                  <div className="text-xs bg-[#1B5E20]/8 text-[#1B5E20] px-2 py-0.5 rounded-full inline-block font-medium">
                    {p.highlight}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Available</p>
                    <p className="text-base font-bold text-[#1B5E20]">{p.available_quantity} {p.unit}</p>
                  </div>
                  <Button asChild size="sm" className="h-8 text-xs">
                    <Link href={`/products/${p.categorySlug}`}>Order <ArrowRight className="w-3 h-3" /></Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
