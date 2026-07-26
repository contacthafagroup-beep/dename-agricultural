"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Leaf, Mail, Phone, MapPin, Globe, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [company, setCompany] = useState({
    name: "Dename Agricultural Supplier",
    email: "contact.dename@gmail.com",
    orders_email: "tilahunmekbib345@gmail.com",
    phone: "+251 954 742 383",
    whatsapp: "+251 954 742 383",
    address: "Hosaena Sport Hotel, Hosaena, Ethiopia",
    website: "https://dename-agricultural.com",
    description: "Ethiopia's premier B2B Agricultural Supplier. Premium export-quality Ethiopian agricultural products for bulk buyers and exporters.",
  });

  const handleSave = () => {
    // In production this would save to a settings table in Supabase
    toast.success("Settings saved successfully!");
  };

  const sections = [
    {
      title: "Company Information",
      icon: Leaf,
      fields: [
        { key: "name", label: "Company Name", type: "text" },
        { key: "website", label: "Website URL", type: "url" },
        { key: "description", label: "Company Description", type: "textarea" },
      ],
    },
    {
      title: "Contact Details",
      icon: Phone,
      fields: [
        { key: "email", label: "General Email", type: "email" },
        { key: "orders_email", label: "Orders Email", type: "email" },
        { key: "phone", label: "Phone Number", type: "tel" },
        { key: "whatsapp", label: "WhatsApp Number", type: "tel" },
      ],
    },
    {
      title: "Address",
      icon: MapPin,
      fields: [
        { key: "address", label: "Office Address", type: "textarea" },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage platform configuration</p>
      </div>

      {sections.map((section, si) => (
        <motion.div key={section.title}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#1B5E20]/10 flex items-center justify-center">
              <section.icon className="w-4 h-4 text-[#1B5E20]" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">{section.title}</h2>
          </div>
          <div className="space-y-4">
            {section.fields.map(f => (
              <div key={f.key}>
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea id={f.key} className="mt-1" rows={3}
                    value={company[f.key as keyof typeof company]}
                    onChange={e => setCompany(p => ({ ...p, [f.key]: e.target.value }))} />
                ) : (
                  <Input id={f.key} type={f.type} className="mt-1"
                    value={company[f.key as keyof typeof company]}
                    onChange={e => setCompany(p => ({ ...p, [f.key]: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Environment Info */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-5 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700 dark:text-amber-400">
          <p className="font-semibold mb-1">Environment Variables</p>
          <p>Configure Supabase URL, API keys, Resend API key, and Google Maps key in your <code className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded font-mono text-xs">.env.local</code> file before deploying.</p>
        </div>
      </div>

      <Button size="lg" onClick={handleSave}>
        <Save className="w-4 h-4" /> Save All Settings
      </Button>
    </div>
  );
}
