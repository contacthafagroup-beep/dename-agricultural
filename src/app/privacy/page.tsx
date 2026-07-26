import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Dename Agricultural Supplier",
};

export default function PrivacyPage() {
  const sections = [
    { title: "1. Information We Collect", content: "We collect your company name, contact person name, email address, phone number, WhatsApp number, country, and address when you register or place an order. We also collect order history, payment records, and communications." },
    { title: "2. How We Use Your Information", content: "We use your information to process orders, send quotations, verify payments, arrange delivery, and communicate with you about your orders. We may also send you updates about new products and availability if you subscribe to our newsletter." },
    { title: "3. Data Sharing", content: "We do not sell your personal or business information to third parties. We may share necessary information with logistics partners and payment processors solely to fulfill your orders." },
    { title: "4. Data Security", content: "We use industry-standard security measures to protect your data. Our platform is hosted on Supabase and Vercel with enterprise-grade security." },
    { title: "5. Your Rights", content: "You may request access to, correction of, or deletion of your personal data by contacting us at contact.dename@gmail.com. We will respond within 30 days." },
    { title: "6. Cookies", content: "We use essential cookies for authentication and platform functionality. We do not use advertising cookies." },
    { title: "7. Contact", content: "For privacy concerns: contact.dename@gmail.com | +251 954 742 383 | Hosaena Sport Hotel, Hosaena, Ethiopia." },
  ];

  return (
    <div className="pt-20 min-h-screen bg-[#F7F7F5] dark:bg-gray-900">
      <div className="bg-[#1B5E20] py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-white/70">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border p-8 space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{s.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/contact" className="text-[#1B5E20] font-semibold text-sm hover:underline">Contact Us →</Link>
        </div>
      </div>
    </div>
  );
}
