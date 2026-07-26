"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, Droplets, ArrowRight, Search, ChevronDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STATIC_CATEGORIES } from "@/types";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import { OrderRequestForm } from "@/components/orders/order-request-form";

type ProductStatus = "available" | "limited" | "sold_out";

interface SubProduct {
  id: string; name: string; nameAm: string; grade: string;
  available_quantity: number; unit: string; minimum_order: number;
  packaging: string; moisture_level?: number; harvest_date: string;
  status: ProductStatus; image: string; description: string;
}

const CATEGORY_PRODUCTS: Record<string, SubProduct[]> = {
  ginger: [
    { id:"g1", name:"Fresh Harvested Ginger", nameAm:"ትኩስ የተሰበሰበ ዝንጅብል", grade:"Grade A Export", available_quantity:180, unit:"MT", minimum_order:5, packaging:"25kg Mesh Bags / 20kg Cartons", moisture_level:85, harvest_date:"2025-01-15", status:"available", image:"https://images.unsplash.com/photo-1615485500834-bc10199bc727?q=80&w=800&auto=format&fit=crop", description:"Freshly harvested from Hadiya Zone partner farms. High pungency, rich aroma, excellent gingerol content. No post-harvest processing." },
    { id:"g2", name:"Fresh Washed Ginger",    nameAm:"ትኩስ የታጠበ ዝንጅብል",   grade:"Grade A — Washed", available_quantity:150, unit:"MT", minimum_order:3, packaging:"10kg Cartons / 25kg Mesh Bags", moisture_level:83, harvest_date:"2025-01-20", status:"available", image:"https://images.unsplash.com/photo-1573789960-0900a3bcd80a?q=80&w=800&auto=format&fit=crop", description:"Thoroughly washed and cleaned. Bright appearance. Meets EU and Asian import standards for fresh ginger." },
    { id:"g3", name:"Fresh Dried Ginger",     nameAm:"ትኩስ የደረቀ ዝንጅብል",  grade:"Grade A Dried", available_quantity:200, unit:"MT", minimum_order:10, packaging:"50kg Jute Bags / 25kg PP Bags", moisture_level:12, harvest_date:"2024-12-10", status:"available", image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop", description:"Sun-dried to 12% moisture. Retains full essential oils and aroma. Ideal for spice processing and extraction." },
    { id:"g4", name:"Washed Dried Ginger",    nameAm:"የታጠበ እና የደረቀ ዝንጅብል", grade:"Grade A — Washed & Dried", available_quantity:120, unit:"MT", minimum_order:5, packaging:"50kg Jute Bags / 25kg PP Bags", moisture_level:11, harvest_date:"2024-12-20", status:"available", image:"https://images.unsplash.com/photo-1615485500834-bc10199bc727?q=80&w=800&auto=format&fit=crop", description:"Washed, cleaned, then sun-dried. Superior appearance, consistent moisture. Premium for EU/US/Asian markets." },
  ],
  coffee: [
    { id:"c1", name:"Hadiya Coffee",           nameAm:"ሃዲያ ቡና",         grade:"Commercial Grade", available_quantity:50, unit:"MT", minimum_order:2, packaging:"60kg Jute/GrainPro Bags", harvest_date:"2024-11-01", status:"available", image:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop", description:"Natural processed Hadiya origin. Fruity, wine-like notes with full body. Consistent cup quality." },
    { id:"c2", name:"Gibe Coffee",             nameAm:"ጊቤ ቡና",          grade:"Commercial Grade", available_quantity:40, unit:"MT", minimum_order:2, packaging:"60kg Jute/GrainPro Bags", harvest_date:"2024-11-15", status:"available", image:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop", description:"Washed Gibe river basin coffee. Clean, bright acidity with citrus notes. Popular with European roasters." },
    { id:"c3", name:"Green Coffee Beans",      nameAm:"አረንጓዴ ቡና",       grade:"Export Grade Green", available_quantity:80, unit:"MT", minimum_order:5, packaging:"60kg GrainPro Bags", harvest_date:"2024-10-20", status:"available", image:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop", description:"Unroasted green Arabica. Moisture 11–12%. Ready for export to roasters worldwide." },
    { id:"c4", name:"Specialty Arabica",       nameAm:"ልዩ አረቢካ ቡና",    grade:"Specialty Q2 (85+)", available_quantity:20, unit:"MT", minimum_order:1, packaging:"30kg GrainPro / Vacuum", harvest_date:"2024-12-01", status:"limited", image:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop", description:"Cup score 85+. Single-origin specialty Ethiopian Arabica for premium roasters and cafes." },
  ],
  rosemary: [
    { id:"r1", name:"Fresh Rosemary",   nameAm:"ትኩስ ሮዝሜሪ",     grade:"Grade A Fresh",    available_quantity:30, unit:"MT", minimum_order:1, packaging:"5kg Cartons / 10kg Boxes", harvest_date:"2025-01-10", status:"available", image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop", description:"Fresh cut from Ethiopian highland farms. Strong aromatic profile, vibrant green colour." },
    { id:"r2", name:"Dried Rosemary",   nameAm:"የደረቀ ሮዝሜሪ",    grade:"Grade A Dried",    available_quantity:20, unit:"MT", minimum_order:1, packaging:"25kg PP Bags / 10kg Cartons", harvest_date:"2024-12-15", status:"available", image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop", description:"Naturally dried with retained essential oils. Culinary and pharmaceutical grade." },
    { id:"r3", name:"Rosemary Leaves",  nameAm:"የሮዝሜሪ ቅጠሎች",  grade:"Processed Grade A", available_quantity:15, unit:"MT", minimum_order:0.5, packaging:"10kg Cartons / 5kg Bags", harvest_date:"2024-11-20", status:"limited", image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop", description:"Stripped, dried, and cleaned rosemary leaves. Used in herbal teas, spice blends, and extracts." },
  ],
  turmeric: [
    { id:"t1", name:"Fresh Turmeric",     nameAm:"ትኩስ ቱርሜሪክ",    grade:"Grade A Fresh",  available_quantity:60, unit:"MT", minimum_order:2, packaging:"25kg Mesh Bags / 20kg Cartons", moisture_level:80, harvest_date:"2025-01-05", status:"available", image:"https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop", description:"Deep orange flesh, high curcumin content. Direct from Hadiya Zone highland farms." },
    { id:"t2", name:"Dry Turmeric",       nameAm:"ደረቅ ቱርሜሪክ",    grade:"Grade A Dried",  available_quantity:45, unit:"MT", minimum_order:3, packaging:"50kg Jute / 25kg PP Bags", moisture_level:10, harvest_date:"2024-12-05", status:"available", image:"https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop", description:"4–5% curcumin content. Bright yellow colour, consistent moisture. For spice and extract industry." },
    { id:"t3", name:"Turmeric Fingers",   nameAm:"የቱርሜሪክ ጣቶች",   grade:"Export Grade",   available_quantity:35, unit:"MT", minimum_order:2, packaging:"25kg PP / 50kg Jute Bags", moisture_level:11, harvest_date:"2024-12-10", status:"available", image:"https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop", description:"Whole turmeric fingers, cleaned and dried. Preferred by processors and extract manufacturers." },
  ],
  garlic: [
    { id:"ga1", name:"Fresh Garlic",   nameAm:"ትኩስ ነጭ ሽንኩርት",     grade:"Grade A Fresh",  available_quantity:80, unit:"MT", minimum_order:3, packaging:"10kg Mesh / 20kg Cartons", moisture_level:70, harvest_date:"2025-01-12", status:"available", image:"https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=800&auto=format&fit=crop", description:"Strong aroma, tight cloves. Freshly harvested for direct export." },
    { id:"ga2", name:"Peeled Garlic",  nameAm:"የተቀሸረ ነጭ ሽንኩርት",   grade:"Grade A Peeled", available_quantity:30, unit:"MT", minimum_order:1, packaging:"5kg Vacuum / 10kg Cartons", harvest_date:"2025-01-08", status:"limited", image:"https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=800&auto=format&fit=crop", description:"Machine and hand-peeled cloves. Bright white, vacuum-sealed for freshness." },
    { id:"ga3", name:"Dried Garlic",   nameAm:"ደረቅ ነጭ ሽንኩርት",     grade:"Dried Grade A",  available_quantity:50, unit:"MT", minimum_order:2, packaging:"25kg PP / 50kg Jute Bags", moisture_level:8, harvest_date:"2024-11-25", status:"available", image:"https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=800&auto=format&fit=crop", description:"Sun-dried slices and granules. Long shelf life, full flavour for food industry." },
  ],
  cardamom: [
    { id:"k1", name:"Whole Cardamom (Korerima)", nameAm:"ሙሉ ኮረሪማ",     grade:"Grade A Whole", available_quantity:15, unit:"MT", minimum_order:0.5, packaging:"10kg Cartons / 25kg Bags", harvest_date:"2024-11-10", status:"available", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop", description:"Ethiopian Korerima (false cardamom). Whole dried pods with smoky-eucalyptus aroma." },
    { id:"k2", name:"Dried Cardamom Seeds",      nameAm:"ደረቅ ኮረሪማ",     grade:"Grade A Seeds", available_quantity:8,  unit:"MT", minimum_order:0.3, packaging:"5kg Vacuum / 10kg Bags", harvest_date:"2024-11-10", status:"limited", image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop", description:"Extracted seeds, cleaned and dried. Highly aromatic for spice blends and beverages." },
  ],
  "black-pepper": [
    { id:"bp1", name:"Whole Black Pepper",  nameAm:"ሙሉ ጥቁር ፍልፍል",    grade:"Grade A Export",   available_quantity:25, unit:"MT", minimum_order:1, packaging:"25kg PP / 50kg Jute", moisture_level:12, harvest_date:"2024-12-20", status:"available", image:"https://images.unsplash.com/photo-1559181567-c3190bfbd7d5?q=80&w=800&auto=format&fit=crop", description:"Whole dried black pepper. Bold flavour, 580–600 g/L bulk density. Direct export grade." },
    { id:"bp2", name:"Ground Black Pepper", nameAm:"የተፈጨ ጥቁር ፍልፍል",  grade:"Processed Grade A", available_quantity:15, unit:"MT", minimum_order:0.5, packaging:"10kg Cartons / 25kg Bags", moisture_level:10, harvest_date:"2024-12-20", status:"available", image:"https://images.unsplash.com/photo-1559181567-c3190bfbd7d5?q=80&w=800&auto=format&fit=crop", description:"Finely ground from premium whole berries. Consistent granule size for food industry." },
  ],
  honey: [
    { id:"h1", name:"White Honey",    nameAm:"ነጭ ማር",     grade:"Premium Grade",     available_quantity:20, unit:"MT", minimum_order:0.5, packaging:"30kg Drums / 5kg Jars", harvest_date:"2024-10-15", status:"available", image:"https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800&auto=format&fit=crop", description:"Rare Ethiopian white honey. Creamy texture, mild sweet flavour. Highly sought after." },
    { id:"h2", name:"Forest Honey",   nameAm:"የጫካ ማር",    grade:"Export Premium",    available_quantity:15, unit:"MT", minimum_order:0.3, packaging:"30kg Drums / 10kg Containers", harvest_date:"2024-10-20", status:"limited", image:"https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800&auto=format&fit=crop", description:"Wild forest honey from Ethiopian highlands. Dark amber, rich complex flavour, naturally organic." },
    { id:"h3", name:"Organic Honey",  nameAm:"ኦርጋኒክ ማር", grade:"Certified Organic", available_quantity:10, unit:"MT", minimum_order:0.3, packaging:"30kg Drums / 5kg Certified Jars", harvest_date:"2024-11-01", status:"limited", image:"https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800&auto=format&fit=crop", description:"Certified organic honey with full documentation. Meets EU organic import standards." },
  ],
};

const categoryImages: Record<string,string> = {
  ginger:"https://images.unsplash.com/photo-1615485500834-bc10199bc727?q=80&w=2070&auto=format&fit=crop",
  coffee:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2070&auto=format&fit=crop",
  rosemary:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=2070&auto=format&fit=crop",
  turmeric:"https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop",
  garlic:"https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?q=80&w=2070&auto=format&fit=crop",
  cardamom:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
  "black-pepper":"https://images.unsplash.com/photo-1559181567-c3190bfbd7d5?q=80&w=2070&auto=format&fit=crop",
  honey:"https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=2070&auto=format&fit=crop",
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SubProduct|null>(null);

  const cat = STATIC_CATEGORIES.find(c => c.slug === category);
  const products: SubProduct[] = CATEGORY_PRODUCTS[category] ?? [];
  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.grade.toLowerCase().includes(search.toLowerCase())
  );

  if (!cat) return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center"><Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-3">Category not found</h2>
        <Link href="/products"><Button>All Products</Button></Link>
      </div>
    </div>
  );

  const faqs = [
    { q:`What is the minimum order for ${cat.name}?`, a:`Minimum orders start from ${products[0]?.minimum_order ?? 1} ${products[0]?.unit ?? "MT"}. Contact us for custom arrangements on smaller quantities.` },
    { q:"What quality certificates do you provide?", a:"All shipments include phytosanitary certificates, certificate of origin, and lab test reports. Third-party inspection (SGS / Bureau Veritas) available on request." },
    { q:"What packaging options are available?", a:"We offer standard export packaging and custom options including jute bags, PP bags, cartons, mesh bags, and vacuum-sealed bags to your specification." },
    { q:"How long does delivery take?", a:"Typically 2–4 weeks from order confirmation to Port of Djibouti. Air freight available for urgent orders." },
    { q:"Can I request a sample before ordering?", a:"Yes. Samples available for serious buyers. Contact us with your requirements to arrange sample shipment." },
  ];

  return (
    <div className="pt-20">
      {/* ── HERO ── */}
      <section className="relative min-h-[460px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage:`url('${categoryImages[category] ?? categoryImages.ginger}')` }} />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#D89C2B] to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
          <Link href="/products"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Categories
          </Link>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.2em]">
                Product Category
              </span>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl">{cat.icon}</span>
              <div>
                <h1 className="font-bold text-white leading-tight" style={{ fontSize:"clamp(2rem,5vw,3.5rem)" }}>
                  {cat.name}
                </h1>
                <p className="text-[#D89C2B] text-xl font-medium">{cat.name_am}</p>
              </div>
            </div>
            <p className="text-white/70 max-w-xl text-base mt-4">{cat.description}</p>
          </motion.div>

          {/* Stats strip */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
            className="flex flex-wrap gap-4 mt-8">
            {[
              { label:`${products.length} Product Types` },
              { label:"Hadiya Zone, Ethiopia" },
              { label:"Export Certified" },
              { label:"Bulk Orders from 0.3 MT" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-3.5 h-3.5 text-[#D89C2B]" />
                <span className="text-white/80 text-xs font-medium">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SEARCH / FILTER ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-border sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/products"
            className="text-muted-foreground hover:text-[#1B5E20] text-sm flex items-center gap-1.5 shrink-0 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Products
          </Link>
          <div className="w-px h-5 bg-border" />
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={`Search ${cat.name}…`} value={search}
              onChange={e => setSearch(e.target.value)} className="pl-10 h-10" />
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            <span className="font-semibold text-[#1B5E20]">{filtered.length}</span> products
          </span>
        </div>
      </div>

      {/* ── PRODUCT CARDS ── */}
      <section className="py-14 bg-[#F7F7F5] dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-semibold text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ duration:0.4, delay:i*0.07 }}
                  whileHover={{ y:-5 }}
                  className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-400">

                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-600 group-hover:scale-110"
                      style={{ backgroundImage:`url('${p.image}')` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}>
                        {getStatusLabel(p.status)}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-sm leading-tight">{p.name}</p>
                      <p className="text-[#D89C2B] text-xs">{p.nameAm}</p>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{p.description}</p>
                    <div className="space-y-1.5 mb-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Package className="w-3 h-3 text-[#1B5E20] shrink-0" /> {p.grade}
                      </div>
                      {p.moisture_level !== undefined && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Droplets className="w-3 h-3 text-[#1B5E20] shrink-0" /> Moisture: {p.moisture_level}%
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 text-[#1B5E20] shrink-0" /> Hadiya Zone, Ethiopia
                      </div>
                      <div className="text-xs bg-[#1B5E20]/8 text-[#1B5E20] px-2.5 py-1 rounded-full inline-block font-medium border border-[#1B5E20]/12">
                        Min order: {p.minimum_order} {p.unit}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Available</p>
                        <p className={`text-base font-bold ${p.status==="sold_out"?"text-red-500":"text-[#1B5E20]"}`}>
                          {p.status==="sold_out"?"Sold Out":`${p.available_quantity} ${p.unit}`}
                        </p>
                      </div>
                      {p.status !== "sold_out" && (
                        <Button size="sm" className="h-8 text-xs"
                          onClick={() => { setSelectedProduct(p); setShowOrderForm(true); }}>
                          Order <ArrowRight className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.18em]">FAQs</span>
              <div className="w-8 h-[2px] bg-[#D89C2B]" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white text-2xl">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ delay:i*0.06 }}
                className="bg-[#F7F7F5] dark:bg-gray-800 rounded-2xl border border-border overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq===i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq===i?"rotate-180":""}`} />
                </button>
                {openFaq===i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTHER CATEGORIES ── */}
      <section className="py-14 bg-[#F7F7F5] dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6">Explore Other Categories</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {STATIC_CATEGORIES.filter(c => c.slug !== category).map(c => (
              <Link key={c.slug} href={`/products/${c.slug}`}
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-border hover:border-[#1B5E20]/40 hover:shadow-md rounded-full px-5 py-2.5 text-sm font-medium transition-all group">
                <span>{c.icon}</span>
                <span className="group-hover:text-[#1B5E20] transition-colors">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.name_am}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {showOrderForm && selectedProduct && (
        <OrderRequestForm
          product={{ id:selectedProduct.id, name:selectedProduct.name, grade:selectedProduct.grade }}
          onClose={() => { setShowOrderForm(false); setSelectedProduct(null); }}
        />
      )}
    </div>
  );
}
