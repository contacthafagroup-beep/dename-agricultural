"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, MessageCircle, Clock,
  Send, Loader2, CheckCircle, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

interface FormState {
  name: string; email: string; phone: string;
  company: string; subject: string; message: string;
}
const empty: FormState = { name:"", email:"", phone:"", company:"", subject:"", message:"" };

const contactCards = [
  {
    icon: MapPin,
    title: "Office Address",
    titleAm: "አድራሻ",
    lines: ["Hosaena Sport Hotel", "Hosaena, Hadiya Zone", "Ethiopia · ሆሳዕና, ኢትዮጵያ"],
    color: "bg-[#1B5E20]/10 text-[#1B5E20]",
    accent: "border-[#1B5E20]/20",
  },
  {
    icon: Phone,
    title: "Phone Numbers",
    titleAm: "ስልክ ቁጥሮች",
    lines: ["+251 954 742 383", "+251 046 555 0111"],
    color: "bg-[#D89C2B]/10 text-[#D89C2B]",
    accent: "border-[#D89C2B]/20",
    href: "tel:+251954742383",
  },
  {
    icon: Mail,
    title: "Email Addresses",
    titleAm: "ኢሜይል",
    lines: ["contact.dename@gmail.com", "tilahunmekbib345@gmail.com"],
    color: "bg-blue-50 text-blue-600",
    accent: "border-blue-200",
    href: "mailto:contact.dename@gmail.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    titleAm: "ዋትስአፕ",
    lines: ["+251 954 742 383", "Available 8am – 8pm EAT"],
    color: "bg-emerald-50 text-emerald-600",
    accent: "border-emerald-200",
    href: "https://wa.me/251954742383",
  },
  {
    icon: Clock,
    title: "Business Hours",
    titleAm: "የሥራ ሰዓቶች",
    lines: ["Mon – Fri: 8:00 AM – 6:00 PM", "Saturday: 8:00 AM – 2:00 PM"],
    color: "bg-purple-50 text-purple-600",
    accent: "border-purple-200",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<"idle"|"loading"|"success">("idle");
  const upd = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill all required fields"); return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus("success"); setForm(empty); toast.success("Message sent!"); }
      else { throw new Error(); }
    } catch { toast.error("Failed to send. Please try again."); setStatus("idle"); }
  };

  return (
    <div className="pt-20">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ minHeight: 380 }}>
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/85 via-[#1B5E20]/55 to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#D89C2B] to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
          <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.65 }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.2em]">
                Contact Us · ያግኙን
              </span>
            </div>
            <h1 className="font-bold text-white leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              Get In Touch<br />
              <span className="text-[#D89C2B]">We&apos;d Love to Hear From You</span>
            </h1>
            <p className="text-white/70 max-w-xl text-base mb-8">
              Want to buy premium Ethiopian agricultural products from us?
              Tell us what you need — we respond within 24 hours with pricing and availability.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://wa.me/251954742383"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd59] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <a href="tel:+251954742383"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/25 backdrop-blur-sm transition-colors">
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-20 bg-[#F7F7F5] dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ── LEFT: Contact cards ── */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-[2px] bg-[#D89C2B]" />
                  <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.18em]">
                    Contact Information
                  </span>
                </div>
                <h2 className="font-bold text-gray-900 dark:text-white text-2xl">
                  Reach Us Anytime
                </h2>
              </motion.div>

              {contactCards.map((card, i) => (
                <motion.div key={card.title}
                  initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 3 }}>
                  {card.href ? (
                    <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-start gap-4 bg-white dark:bg-gray-900 rounded-2xl p-5 border ${card.accent} hover:shadow-md transition-all duration-300 group`}>
                      <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">
                          {card.title} <span className="text-[#D89C2B] font-normal text-xs">· {card.titleAm}</span>
                        </p>
                        {card.lines.map(l => (
                          <p key={l} className="text-sm text-muted-foreground">{l}</p>
                        ))}
                      </div>
                    </a>
                  ) : (
                    <div className={`flex items-start gap-4 bg-white dark:bg-gray-900 rounded-2xl p-5 border ${card.accent}`}>
                      <div className={`w-11 h-11 rounded-xl ${card.color} flex items-center justify-center shrink-0`}>
                        <card.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">
                          {card.title} <span className="text-[#D89C2B] font-normal text-xs">· {card.titleAm}</span>
                        </p>
                        {card.lines.map(l => (
                          <p key={l} className="text-sm text-muted-foreground">{l}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* WhatsApp CTA card */}
              <motion.a href="https://wa.me/251954742383?text=Hello%2C%20I%27m%20interested%20in%20sourcing%20Ethiopian%20agricultural%20products"
                target="_blank" rel="noopener noreferrer"
                initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                whileHover={{ scale:1.02 }}
                className="flex items-center gap-4 bg-[#25D366] text-white rounded-2xl p-5 hover:bg-[#20bd59] transition-colors group">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Start a WhatsApp Chat</p>
                  <p className="text-white/80 text-xs">Fastest way to reach our team · ፈጣን ምላሽ</p>
                </div>
                <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>

            {/* ── RIGHT: Contact form ── */}
            <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.6 }}
              className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-3xl border border-border shadow-lg p-8 lg:p-10">

              {status === "success" ? (
                <div className="text-center py-12">
                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                    transition={{ type:"spring", bounce:0.5 }}>
                    <div className="w-20 h-20 bg-[#1B5E20]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-10 h-10 text-[#1B5E20]" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Thank you for reaching out. We&apos;ll reply within 24 hours.
                  </p>
                  <p className="text-[#D89C2B] text-sm font-medium mb-8">
                    ለደርሰናቸው — ምላሽ በ24 ሰዓት ውስጥ ይጠብቁ
                  </p>
                  <Button onClick={() => setStatus("idle")}>Send Another Message</Button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-[2px] bg-[#D89C2B]" />
                      <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.18em]">
                        Send a Message
                      </span>
                    </div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-2xl">
                      How Can We Help You?
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Fill in the form and our team will get back to you within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</Label>
                        <Input id="name" placeholder="John Doe" className="mt-1.5"
                          value={form.name} onChange={e => upd("name", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address *</Label>
                        <Input id="email" type="email" placeholder="john@company.com" className="mt-1.5"
                          value={form.email} onChange={e => upd("email", e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                        <Input id="phone" placeholder="+1 234 567 890" className="mt-1.5"
                          value={form.phone} onChange={e => upd("phone", e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="company" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company Name</Label>
                        <Input id="company" placeholder="Your company" className="mt-1.5"
                          value={form.company} onChange={e => upd("company", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject *</Label>
                      <Input id="subject" placeholder="e.g. Bulk ginger order inquiry" className="mt-1.5"
                        value={form.subject} onChange={e => upd("subject", e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message *</Label>
                      <Textarea id="message" rows={5}
                        placeholder="Tell us what product you need, what quantity, your destination, and any special requirements. We will respond with pricing within 24 hours."
                        className="mt-1.5"
                        value={form.message} onChange={e => upd("message", e.target.value)} required />
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
                      {status === "loading" ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      We typically respond within 24 business hours · ምላሽ በ24 ሰዓት ውስጥ
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="bg-white dark:bg-gray-900 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-0">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} className="mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-[#D89C2B]" />
              <span className="text-[#D89C2B] text-xs font-bold uppercase tracking-[0.18em]">
                Find Us · አድራሻ
              </span>
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white text-xl mt-1">
              Hosaena Sport Hotel, Hosaena, Ethiopia
            </h2>
          </motion.div>
        </div>
        <div className="h-80 relative overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.7!2d37.8543!3d7.5534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHosaena+Sport+Hotel!5e0!3m2!1sen!2set!4v1"
            width="100%" height="100%" style={{ border:0 }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dename Agricultural Supplier — Hosaena, Ethiopia"
          />
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES STRIP ── */}
      <section className="py-14 bg-[#F7F7F5] dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground text-sm mb-6">
            We supply across <span className="font-semibold text-[#1B5E20]">8 agricultural product categories</span> — contact us for any of them:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon:"🫚", name:"Ginger",       slug:"ginger" },
              { icon:"☕", name:"Coffee",       slug:"coffee" },
              { icon:"🌿", name:"Rosemary",     slug:"rosemary" },
              { icon:"🟡", name:"Turmeric",     slug:"turmeric" },
              { icon:"🧄", name:"Garlic",       slug:"garlic" },
              { icon:"🌱", name:"Cardamom",     slug:"cardamom" },
              { icon:"⚫", name:"Black Pepper", slug:"black-pepper" },
              { icon:"🍯", name:"Honey",        slug:"honey" },
            ].map(p => (
              <Link key={p.slug} href={`/products/${p.slug}`}
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-border hover:border-[#1B5E20]/40 hover:shadow-md rounded-full px-4 py-2 text-sm font-medium transition-all group">
                {p.icon}
                <span className="group-hover:text-[#1B5E20] transition-colors">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
