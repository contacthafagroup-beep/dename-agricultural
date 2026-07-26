"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const categories = ["All", "Warehouse", "Farm", "Products", "Packing", "Transportation", "Coffee", "Honey"];

const galleryItems = [
  {
    id: 1,
    title: "Main Processing Warehouse",
    category: "Warehouse",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
    description: "Our 5,000 m² temperature-controlled warehouse in Hosaena",
  },
  {
    id: 2,
    title: "Agricultural Farm - Hadiya Zone",
    category: "Farm",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop",
    description: "Partner farms in Hadiya Zone, Ethiopia",
  },
  {
    id: 3,
    title: "Premium Fresh Products",
    category: "Products",
    image: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?q=80&w=1200&auto=format&fit=crop",
    description: "Grade A fresh agricultural products ready for export",
  },
  {
    id: 4,
    title: "Packaging Line",
    category: "Packing",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200&auto=format&fit=crop",
    description: "Professional packaging in 25kg mesh bags",
  },
  {
    id: 5,
    title: "Export Container Loading",
    category: "Transportation",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop",
    description: "Loading containers for Port of Djibouti",
  },
  {
    id: 6,
    title: "Sorting & Grading",
    category: "Packing",
    image: "https://images.unsplash.com/photo-1573789960-0900a3bcd80a?q=80&w=1200&auto=format&fit=crop",
    description: "Manual quality sorting and grading process",
  },
  {
    id: 7,
    title: "Agricultural Fields - Hadiya Zone",
    category: "Farm",
    image: "https://images.unsplash.com/photo-1445531097440-66c3bb8ca5f7?q=80&w=1200&auto=format&fit=crop",
    description: "Agricultural farms managed by Dename partner farmers",
  },
  {
    id: 8,
    title: "Product Processing Facility",
    category: "Products",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=1200&auto=format&fit=crop",
    description: "Product processing and preparation",
  },
  {
    id: 9,
    title: "Cold Storage Room",
    category: "Warehouse",
    image: "https://images.unsplash.com/photo-1586528116022-a83e2870ce14?q=80&w=1200&auto=format&fit=crop",
    description: "Humidity and temperature controlled storage",
  },
  {
    id: 10,
    title: "Farm Harvest Day",
    category: "Farm",
    image: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1200&auto=format&fit=crop",
    description: "Farmers harvesting fresh agricultural products",
  },
  {
    id: 11,
    title: "Refrigerated Transport",
    category: "Transportation",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200&auto=format&fit=crop",
    description: "Refrigerated trucks for farm-to-warehouse transport",
  },
  {
    id: 12,
    title: "Carton Packaging",
    category: "Packing",
    image: "https://images.unsplash.com/photo-1634704784915-aacf363b021f?q=80&w=1200&auto=format&fit=crop",
    description: "Export cartons being filled and sealed",
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<typeof galleryItems[0] | null>(null);

  const filtered = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-[#1B5E20] text-white text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#D89C2B] font-semibold text-sm uppercase tracking-widest block mb-3"
        >
          Gallery
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl lg:text-5xl font-bold"
        >
          Our Facilities & Operations
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/80 mt-4 max-w-xl mx-auto"
        >
          A visual tour of our farms, warehouse, processing facilities, and logistics operations.
        </motion.p>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white dark:bg-gray-900 sticky top-16 z-30 border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-[#1B5E20] text-white"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-[#F7F7F5] dark:bg-gray-800 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => setSelected(item)}
                  className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-border card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-44 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="text-xs bg-[#1B5E20] text-white px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
            >
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full max-h-[70vh] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white font-bold text-xl">{selected.title}</h3>
                <p className="text-white/70 text-sm mt-1">{selected.description}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
