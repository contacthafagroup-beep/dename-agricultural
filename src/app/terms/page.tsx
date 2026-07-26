import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Dename Agricultural Supplier",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Introduction",
      content: "These Terms of Service govern your use of the Dename Agricultural Supplier platform (\"Dename\", \"we\", \"us\"). By registering or placing an order, you agree to these terms. Dename Agricultural Supplier is a B2B agricultural supply company based in Hosaena, Hadiya Zone, Ethiopia."
    },
    {
      title: "2. Who Can Use This Platform",
      content: "This platform is exclusively for business-to-business (B2B) transactions. Users must be registered businesses, export companies, food processors, trading companies, or bulk buyers. Retail purchases are not accepted. You must provide accurate company information when registering."
    },
    {
      title: "3. Orders and Quotations",
      content: "All orders submitted through this platform are requests that require confirmation from Dename. An order becomes binding only after: (a) Dename sends a formal quotation, (b) the buyer accepts the quotation, and (c) payment arrangements are confirmed. Prices shown on the platform are indicative and subject to change based on current market conditions, quantity, and logistics."
    },
    {
      title: "4. Payment Terms",
      content: "Payment must be made according to the terms specified in the accepted quotation. Supported payment methods include Commercial Bank of Ethiopia (CBE), Telebirr, Awash Bank, Dashen Bank, Bank of Abyssinia, and other methods as agreed. Dename reserves the right to withhold shipment until full payment or agreed partial payment is received and verified."
    },
    {
      title: "5. Product Quality and Specifications",
      content: "Dename sources products directly from certified partner farmers in Hadiya Zone, Ethiopia. All products are inspected before shipment. Product specifications (grade, moisture level, packaging) are as described on the platform and in the quotation. Minor natural variations may occur in agricultural products."
    },
    {
      title: "6. Delivery and Logistics",
      content: "Dename currently operates road transport within Ethiopia. Delivery timelines are estimates and may vary due to weather, road conditions, and other factors beyond our control. Dename will notify buyers of any significant delays. Risk of loss transfers to the buyer upon delivery to the agreed destination."
    },
    {
      title: "7. Cancellations and Refunds",
      content: "Orders may be cancelled before a quotation is accepted without penalty. After quotation acceptance, cancellation may incur charges for costs already incurred. Refunds are processed within 14 business days of approval. Disputes must be raised within 7 days of delivery."
    },
    {
      title: "8. Intellectual Property",
      content: "All content on this platform — including product descriptions, images, and text — is the property of Dename Agricultural Supplier. You may not reproduce or redistribute any content without written permission."
    },
    {
      title: "9. Privacy",
      content: "We collect and process your business information to fulfill orders and improve our services. We do not sell your data to third parties. See our Privacy Policy for full details."
    },
    {
      title: "10. Governing Law",
      content: "These terms are governed by the laws of the Federal Democratic Republic of Ethiopia. Any disputes will be resolved through negotiation first, then through the appropriate courts in Ethiopia."
    },
    {
      title: "11. Contact",
      content: "For questions about these terms, contact us at: contact.dename@gmail.com | +251 954 742 383 | Hosaena Sport Hotel, Hosaena, Ethiopia."
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-[#F7F7F5] dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-[#1B5E20] py-16 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-white/70">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border p-8 space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/contact" className="text-[#1B5E20] font-semibold text-sm hover:underline">
            Questions? Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
}
