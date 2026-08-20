"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package, Users, Sparkles, Gift, Warehouse,
  Truck, Search, FileCheck, ArrowRight, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "bulk-supply",
    icon: Package,
    title: "Bulk Supply",
    subtitle: "1 MT to 500 MT per order",
    color: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-[#1B5E20]",
    description:
      "We specialize in large-quantity agricultural product supply for export. Whether you need 1 MT or 500 MT across any of our 8 product categories, we fulfill requirements with consistent quality.",
    features: [
      "Minimum order 1 MT, maximum 500 MT per shipment",
      "Consistent quality across large batches",
      "Flexible delivery scheduling",
      "Volume discount pricing available",
      "Buffer stock maintained for urgent orders",
      "Multiple grades available (A, B, Organic)",
    ],
  },
  {
    id: "farmer-sourcing",
    icon: Users,
    title: "Farmer Sourcing",
    subtitle: "Direct from 500+ farmers",
    color: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-[#D89C2B]",
    description:
      "We source directly from our network of 500+ certified farmers across 12 Ethiopian regions. Our farm-level relationships ensure we get the freshest, highest-quality products at competitive prices.",
    features: [
      "500+ partner farmers across Ethiopia",
      "Hadiya Zone and surrounding agricultural regions",
      "Fair Trade pricing to farmers",
      "Regular farm visits and quality checks",
      "Harvest timing guidance for optimal quality",
      "Year-round supply through seasonal planning",
    ],
  },
  {
    id: "sorting",
    icon: Sparkles,
    title: "Sorting & Cleaning",
    subtitle: "Export-standard processing",
    color: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600",
    description:
      "Our modern processing facility in Hosaena handles comprehensive sorting, cleaning, and grading of all products before packaging. We remove damaged items, clean and grade by size and quality.",
    features: [
      "Manual and machine sorting",
      "Thorough washing and cleaning",
      "Size grading (small, medium, large)",
      "Quality grading (Grade A, B, C)",
      "Removal of damaged or diseased roots",
      "HACCP-certified processing facility",
    ],
  },
  {
    id: "packaging",
    icon: Gift,
    title: "Packaging",
    subtitle: "Custom packaging solutions",
    color: "bg-purple-50 dark:bg-purple-900/20",
    iconColor: "text-purple-600",
    description:
      "We offer flexible packaging options to meet your specific requirements. From traditional mesh bags to custom-branded cartons, we can accommodate various packaging specifications for different markets.",
    features: [
      "25kg mesh bags (standard export)",
      "10kg and 20kg cartons",
      "50kg jute bags (bulk)",
      "Custom branded packaging available",
      "Organic-certified packaging options",
      "Vacuum-sealed packaging for longer shelf life",
    ],
  },
  {
    id: "storage",
    icon: Warehouse,
    title: "Cold Storage",
    subtitle: "5,000 m² warehouse",
    color: "bg-cyan-50 dark:bg-cyan-900/20",
    iconColor: "text-cyan-600",
    description:
      "Our temperature-controlled warehouse in Hosaena provides optimal storage conditions for fresh agricultural products. We maintain buffer stock to handle urgent orders and seasonal supply variations.",
    features: [
      "5,000 m² temperature-controlled warehouse",
      "Humidity-controlled storage rooms",
      "Buffer stock of 200+ MT maintained",
      "24/7 security and monitoring",
      "FIFO (First In, First Out) stock management",
      "Regular quality checks during storage",
    ],
  },
  {
    id: "transportation",
    icon: Truck,
    title: "Transportation",
    subtitle: "Farm to port logistics",
    color: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600",
    description:
      "We manage the complete logistics chain from farm to port. Our fleet of refrigerated trucks and established partnerships with freight forwarders ensure timely delivery to Port of Djibouti for international shipping.",
    features: [
      "Refrigerated farm-to-warehouse transport",
      "Customs clearance assistance",
      "Port of Djibouti connections",
      "FCL and LCL shipping options",
      "Real-time shipment tracking",
      "Insurance and documentation support",
    ],
  },
  {
    id: "quality",
    icon: Search,
    title: "Quality Inspection",
    subtitle: "Third-party certified",
    color: "bg-rose-50 dark:bg-rose-900/20",
    iconColor: "text-rose-600",
    description:
      "Every shipment undergoes rigorous quality inspection by both our internal team and accredited third-party inspection companies. We provide comprehensive quality certificates with each order.",
    features: [
      "Internal quality checks at every stage",
      "Third-party inspection available (SGS, Bureau Veritas)",
      "Lab testing for pesticide residues",
      "Moisture content verification",
      "Microbiological testing on request",
      "Quality certificates provided",
    ],
  },
  {
    id: "export",
    icon: FileCheck,
    title: "Export Preparation",
    subtitle: "Complete documentation",
    color: "bg-emerald-50 dark:bg-emerald-900/20",
    iconColor: "text-emerald-600",
    description:
      "We handle all export documentation and compliance requirements. Our experienced team ensures all paperwork is accurate and complete, reducing delays at customs and facilitating smooth import in destination countries.",
    features: [
      "Phytosanitary certificates (EPZA)",
      "Certificate of Origin (Chamber of Commerce)",
      "Commercial invoices and packing lists",
      "Bill of Lading coordination",
      "EU, US, and Asian market compliance",
      "Fumigation certificates when required",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 bg-[#1B5E20] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-[#D89C2B] rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D89C2B] font-semibold text-sm uppercase tracking-widest block mb-3"
          >
            Our Services
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold mb-4"
          >
            Complete Supply Chain Solutions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/80 max-w-2xl mx-auto"
          >
            From farm sourcing to port delivery — we handle every step of the 
            agricultural supply chain with expertise, precision, and care.
          </motion.p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-[#F7F7F5] dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${service.color} mb-5`}>
                    <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                  </div>
                  <p className="text-[#D89C2B] font-semibold text-sm uppercase tracking-widest mb-2">
                    {service.subtitle}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <Button asChild>
                    <Link href="/contact">Get a Quote <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>

                <div className={`${index % 2 === 1 ? "lg:order-1" : ""} bg-white dark:bg-gray-900 rounded-2xl p-6 border border-border`}>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-widest">
                    What&apos;s Included
                  </h3>
                  <div className="space-y-3">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#1B5E20] shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to Work With Us?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Contact us today to discuss your requirements and get a customized quote 
              to purchase our agricultural products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
