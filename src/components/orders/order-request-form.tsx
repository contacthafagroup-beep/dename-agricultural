"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, Loader2, ShoppingBag, Mic, Video, Camera, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MediaOrderForm } from "@/components/orders/media-order-form";
import { toast } from "sonner";

interface OrderFormData {
  company_name: string; contact_person: string; email: string;
  phone: string; whatsapp: string; address: string;
  grade: string; grade_custom: string; quantity: string; unit: string;
  packaging: string; packaging_custom: string;
  delivery_destination: string; preferred_delivery_date: string;
  payment_method: string; urgency: string;
  special_requirements: string;
}

interface OrderRequestFormProps {
  product: { id: string; name: string; grade: string; };
  onClose: () => void;
}

// All products & grades — with Amharic
const GRADE_OPTIONS = [
  "Fresh Harvested Ginger — ትኩስ የተሰበሰበ ዝንጅብል",
  "Fresh Washed Ginger — ትኩስ የታጠበ ዝንጅብል",
  "Fresh Dried Ginger — ትኩስ የደረቀ ዝንጅብል",
  "Washed Dried Ginger — የታጠበ እና የደረቀ ዝንጅብል",
  "Hadiya Coffee — ሃዲያ ቡና",
  "Gibe Coffee — ጊቤ ቡና",
  "Green Coffee Beans — አረንጓዴ ቡና",
  "Specialty Arabica Coffee — ልዩ አረቢካ ቡና",
  "Fresh Rosemary — ትኩስ ሮዝሜሪ",
  "Dried Rosemary — የደረቀ ሮዝሜሪ",
  "Rosemary Leaves — የሮዝሜሪ ቅጠሎች",
  "Fresh Turmeric — ትኩስ ቱርሜሪክ",
  "Dry Turmeric — ደረቅ ቱርሜሪክ",
  "Turmeric Fingers — የቱርሜሪክ ጣቶች",
  "Fresh Garlic — ትኩስ ነጭ ሽንኩርት",
  "Peeled Garlic — የተቀሸረ ነጭ ሽንኩርት",
  "Dried Garlic — ደረቅ ነጭ ሽንኩርት",
  "Whole Cardamom (Korerima) — ሙሉ ኮረሪማ",
  "Dried Cardamom Seeds — ደረቅ ኮረሪማ",
  "Whole Black Pepper — ሙሉ ጥቁር ፍልፍል",
  "Ground Black Pepper — የተፈጨ ጥቁር ፍልፍል",
  "White Honey — ነጭ ማር",
  "Forest Honey — የጫካ ማር",
  "Organic Honey — ኦርጋኒክ ማር",
  "Other / Custom — ሌላ ምርት",
];

const PACKAGING_OPTIONS = [
  "25kg Mesh Bags — 25 ኪሎ ሜሽ ቦርሳ",
  "20kg Mesh Bags — 20 ኪሎ ሜሽ ቦርሳ",
  "10kg Cartons — 10 ኪሎ ካርቶን",
  "20kg Cartons — 20 ኪሎ ካርቶን",
  "50kg Jute Bags — 50 ኪሎ ጁቴ ቦርሳ",
  "25kg PP Bags — 25 ኪሎ ፒፒ ቦርሳ",
  "60kg GrainPro Bags — 60 ኪሎ (ቡና)",
  "30kg Drums — 30 ኪሎ ዲራም (ማር)",
  "5kg Jars — 5 ኪሎ ጠርሙስ (ማር)",
  "Vacuum Bags — ቫኩም ቦርሳ",
  "Custom / ልዩ ማሸጊያ — ሌላ",
];

const UNIT_OPTIONS = [
  { value: "MT", label: "MT — ሜትሪክ ቶን" },
  { value: "KG", label: "KG — ኪሎ ግራም" },
  { value: "Quintal", label: "Quintal — ኩንታል" },
  { value: "Liter", label: "Liter — ሊትር" },
  { value: "Drum", label: "Drum — ዲራም" },
  { value: "Bag", label: "Bag — ቦርሳ" },
  { value: "Carton", label: "Carton — ካርቶን" },
];

const PAYMENT_OPTIONS = [
  "Commercial Bank of Ethiopia (CBE) — የኢትዮጵያ ንግድ ባንክ",
  "Telebirr — ቴሌብር",
  "Awash Bank — አዋሽ ባንክ",
  "Dashen Bank — ዳሽን ባንክ",
  "Bank of Abyssinia — አቢሲኒያ ባንክ",
  "CBE Birr — ሲቢኢ ብር",
  "Cash on Delivery — ስለ ደረሰ ይከፈላል",
  "To be discussed — በኋላ ይወሰናል",
];

const URGENCY_OPTIONS = [
  "Standard (2–4 weeks) — መደበኛ (2–4 ሳምንት)",
  "Urgent (within 1 week) — አስቸኳይ (ከ1 ሳምንት ውስጥ)",
  "Flexible — ተለዋዋጭ",
];

// Reusable native select style
const selectClass = "w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] cursor-pointer appearance-none";

export function OrderRequestForm({ product, onClose }: OrderRequestFormProps) {
  const [form, setForm] = useState<OrderFormData>({
    company_name: "", contact_person: "", email: "", phone: "", whatsapp: "",
    address: "", grade: product.grade || "", grade_custom: "",
    quantity: "", unit: "MT", packaging: "", packaging_custom: "",
    delivery_destination: "Ethiopia", preferred_delivery_date: "",
    payment_method: "", urgency: "Standard (2–4 weeks) — መደበኛ (2–4 ሳምንት)",
    special_requirements: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [showMedia, setShowMedia] = useState(false);

  if (showMedia) {
    return <MediaOrderForm product={product} onClose={onClose} />;
  }

  const upd = (k: keyof OrderFormData, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.company_name.trim()) e.company_name = "Required";
    if (!form.contact_person.trim()) e.contact_person = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.quantity.trim()) e.quantity = "Required";
    if (!form.packaging.trim()) e.packaging = "Required";
    if (!form.preferred_delivery_date.trim()) e.preferred_delivery_date = "Required";
    if (form.grade === "Other / Custom — ሌላ" && !form.grade_custom.trim()) e.grade_custom = "Please describe what you want";
    if (form.packaging === "Custom / ልዩ ማሸጊያ" && !form.packaging_custom.trim()) e.packaging_custom = "Please describe packaging";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const finalGrade = form.grade === "Other / Custom — ሌላ" ? form.grade_custom : form.grade;
  const finalPackaging = form.packaging === "Custom / ልዩ ማሸጊያ" ? form.packaging_custom : form.packaging;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { toast.error("Please fill required fields · ሁሉንም ሜዳዎች ይሙሉ"); return; }
    setIsLoading(true);
    try {
      const payload = {
        ...form, product_id: product.id,
        grade: finalGrade, packaging: finalPackaging,
        shipping_method: "Road Transport",
        country: "Ethiopia",
        special_requirements: `${form.urgency ? "Urgency: " + form.urgency + " | " : ""}${form.payment_method ? "Payment: " + form.payment_method + " | " : ""}${form.special_requirements}`,
      };
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) { setSubmitted(true); toast.success("Order placed! · ትዕዛዝ ደርሷል!"); }
      else { const err = await res.json(); toast.error(err.message || "Failed"); }
    } catch { toast.error("Network error. Try again."); }
    finally { setIsLoading(false); }
  };

  // Field wrapper
  const F = ({ id, label, am, error, children }: {
    id: string; label: string; am: string; error?: string; children: React.ReactNode;
  }) => (
    <div>
      <Label htmlFor={id} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
        {label} <span className="text-[#D89C2B] font-normal normal-case tracking-normal">· {am}</span>
      </Label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto pt-6 pb-10 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B5E20]/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-[#1B5E20]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Place Your Order <span className="text-[#D89C2B] font-medium text-sm">· ትዕዛዝ ያስገቡ</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                {product.name} — We send pricing within 24hrs · ዋጋ በ24 ሰዓት
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── MEDIA ORDER BANNER ── */}
        {!submitted && (
          <div className="mx-5 mt-5 rounded-2xl border-2 border-dashed border-[#1B5E20]/40 bg-[#1B5E20]/5 p-4">
            <p className="text-sm font-bold text-[#1B5E20] mb-1 flex items-center gap-2">
              <span className="text-lg">🎙️</span>
              ORDER BY VOICE, VIDEO, PHOTO OR FILE
              <span className="text-xs font-normal text-[#D89C2B]">· በሚዲያ ለማዘዝ</span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Don&apos;t want to fill the form? Record a voice message, take a photo of your requirement,
              or upload any file — we will handle the rest.
              <span className="block mt-0.5 text-[#D89C2B]/80">ቅጽ ሳይሞሉ — በድምፅ፣ ቪዲዮ፣ ፎቶ ወይም ፋይል ማዘዝ ይቻላል።</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowMedia(true)}
                className="flex items-center gap-1.5 bg-[#1B5E20] text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer hover:bg-[#2E7D32] transition-colors">
                <Mic className="w-4 h-4" /> Voice Order · ድምፅ
              </button>
              <button onClick={() => setShowMedia(true)}
                className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer hover:bg-blue-700 transition-colors">
                <Video className="w-4 h-4" /> Video · ቪዲዮ
              </button>
              <button onClick={() => setShowMedia(true)}
                className="flex items-center gap-1.5 bg-[#D89C2B] text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer hover:bg-[#C68A1A] transition-colors">
                <Camera className="w-4 h-4" /> Photo · ፎቶ
              </button>
              <button onClick={() => setShowMedia(true)}
                className="flex items-center gap-1.5 bg-purple-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer hover:bg-purple-700 transition-colors">
                <Upload className="w-4 h-4" /> Upload File · ፋይል
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <span className="text-[#1B5E20]">↓</span>
              Or fill the form below · ወይም ከታች ያለውን ቅጽ ይሙሉ
            </p>
          </div>
        )}

        {submitted ? (          <div className="p-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <div className="w-16 h-16 bg-[#1B5E20]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-[#1B5E20]" />
              </div>
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Order Received! · ትዕዛዝ ደርሷል!</h3>
            <p className="text-muted-foreground text-sm mb-1">Thank you for ordering from Dename Agricultural Supplier.</p>
            <p className="text-[#D89C2B] text-sm font-medium mb-6">ከደናሜ ስላዘዙ እናመሰግናለን። በ24 ሰዓት ዋጋ እንልክልዎታለን።</p>
            <div className="bg-[#1B5E20]/5 border border-[#1B5E20]/15 rounded-xl p-4 text-xs text-left mb-6 space-y-1 text-muted-foreground">
              <p className="font-bold text-[#1B5E20]">What happens next? · ቀጥሎ ምን ይሆናል?</p>
              <p>1. We review your order · ትዕዛዝዎን እናያለን</p>
              <p>2. We send you pricing within 24hrs · ዋጋ እንልካለን</p>
              <p>3. You approve &amp; pay · ይቀበሉና ይከፍሉ</p>
              <p>4. We prepare and deliver · ምርቱን አዘጋጅተን እናቀርባለን</p>
            </div>
            <Button onClick={onClose} className="w-full">Close · ዝጋ</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">

            {/* Section 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span className="text-[10px] font-bold text-[#1B5E20] uppercase tracking-widest">
                  What You Want to Buy <span className="text-[#D89C2B]">· ምን ማዘዝ ይፈልጋሉ?</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Product / Grade dropdown */}
                <div className="sm:col-span-2">
                  <F id="grade" label="Product / Grade" am="ምርት / ደረጃ (አማራጭ)">
                    <select id="grade" className={selectClass} value={form.grade} onChange={e => upd("grade", e.target.value)}>
                      <option value="">Select a product (optional) · ምርት ይምረጡ</option>
                      {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </F>
                  {form.grade === "Other / Custom — ሌላ" && (
                    <Input className="mt-2" placeholder="Describe what you want · ምን ምርት ይፈልጋሉ?"
                      value={form.grade_custom} onChange={e => upd("grade_custom", e.target.value)} />
                  )}
                  {errors.grade_custom && <p className="text-red-500 text-xs mt-1">{errors.grade_custom}</p>}
                </div>

                {/* Quantity + Unit — full width for visibility */}
                <div className="sm:col-span-2">
                  <F id="quantity" label="Quantity *" am="መጠን *" error={errors.quantity}>
                    <div className="flex gap-3">
                      <input
                        id="quantity"
                        type="number"
                        min="0.1"
                        step="0.1"
                        placeholder="Enter quantity · ብዛቱን ያስገቡ (e.g. 10)"
                        className="flex-1 min-w-0 h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] focus:border-[#1B5E20]"
                        value={form.quantity}
                        onChange={e => upd("quantity", e.target.value)}
                      />
                      <select
                        aria-label="Unit"
                        className="w-32 shrink-0 h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] cursor-pointer"
                        value={form.unit}
                        onChange={e => upd("unit", e.target.value)}
                      >
                        {UNIT_OPTIONS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                      </select>
                    </div>
                  </F>
                </div>

                {/* Packaging */}
                <div>
                  <F id="packaging" label="Packaging *" am="ማሸጊያ *" error={errors.packaging}>
                    <select id="packaging" className={selectClass} value={form.packaging} onChange={e => upd("packaging", e.target.value)}>
                      <option value="">Select packaging · ይምረጡ</option>
                      {PACKAGING_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </F>
                  {form.packaging === "Custom / ልዩ ማሸጊያ" && (
                    <Input className="mt-2" placeholder="Describe your packaging · ማሸጊያ ይግለጹ"
                      value={form.packaging_custom} onChange={e => upd("packaging_custom", e.target.value)} />
                  )}
                  {errors.packaging_custom && <p className="text-red-500 text-xs mt-1">{errors.packaging_custom}</p>}
                </div>

                {/* Delivery destination */}
                <div>
                  <F id="delivery_destination" label="Delivery Destination" am="መድረሻ">
                    <input id="delivery_destination"
                      className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                      placeholder="City or area in Ethiopia · ከተማ ወይም ቦታ"
                      value={form.delivery_destination} onChange={e => upd("delivery_destination", e.target.value)} />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Road transport within Ethiopia only · ጭነት ኢትዮጵያ ውስጥ ብቻ
                    </p>
                  </F>
                </div>

                {/* Date */}
                <div>
                  <F id="preferred_delivery_date" label="Preferred Delivery Date *" am="የሚፈልጉት ቀን *" error={errors.preferred_delivery_date}>
                    <input id="preferred_delivery_date" type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] cursor-pointer"
                      value={form.preferred_delivery_date} onChange={e => upd("preferred_delivery_date", e.target.value)} />
                  </F>
                </div>

                {/* Payment Method */}
                <div>
                  <F id="payment_method" label="Preferred Payment Method" am="የሚፈልጉት የክፍያ ዘዴ">
                    <select id="payment_method" className={selectClass}
                      value={form.payment_method} onChange={e => upd("payment_method", e.target.value)}>
                      <option value="">Select · ይምረጡ</option>
                      {PAYMENT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </F>
                </div>

                {/* Urgency */}
                <div>
                  <F id="urgency" label="Order Urgency" am="የትዕዛዙ አስቸኳይነት">
                    <select id="urgency" className={selectClass}
                      value={form.urgency} onChange={e => upd("urgency", e.target.value)}>
                      {URGENCY_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </F>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-[#1B5E20] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span className="text-[10px] font-bold text-[#1B5E20] uppercase tracking-widest">
                  Your Information <span className="text-[#D89C2B]">· የእርስዎ መረጃ</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <F id="company_name" label="Company Name *" am="የኩባንያ ስም *" error={errors.company_name}>
                    <Input id="company_name" placeholder="Your company · ኩባንያዎ"
                      value={form.company_name} onChange={e => upd("company_name", e.target.value)} />
                  </F>
                </div>
                <div>
                  <F id="contact_person" label="Contact Person *" am="ተወካይ ስም *" error={errors.contact_person}>
                    <Input id="contact_person" placeholder="Full name · ሙሉ ስም"
                      value={form.contact_person} onChange={e => upd("contact_person", e.target.value)} />
                  </F>
                </div>
                <div>
                  <F id="email" label="Email *" am="ኢሜይል *" error={errors.email}>
                    <Input id="email" type="email" placeholder="your@company.com"
                      value={form.email} onChange={e => upd("email", e.target.value)} />
                  </F>
                </div>
                <div>
                  <F id="phone" label="Phone *" am="ስልክ *" error={errors.phone}>
                    <Input id="phone" type="tel" placeholder="+251 or international"
                      value={form.phone} onChange={e => upd("phone", e.target.value)} />
                  </F>
                </div>
                <div>
                  <F id="whatsapp" label="WhatsApp" am="ዋትስአፕ">
                    <Input id="whatsapp" type="tel" placeholder="+251 or international"
                      value={form.whatsapp} onChange={e => upd("whatsapp", e.target.value)} />
                  </F>
                </div>
                <div>
                  <F id="address" label="Address" am="አድራሻ">
                    <Input id="address" placeholder="Town / area in Ethiopia · ቦታ"
                      value={form.address} onChange={e => upd("address", e.target.value)} />
                  </F>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <F id="special_requirements" label="Special Requirements" am="ልዩ ፍላጎቶች">
                <Textarea id="special_requirements" rows={2}
                  placeholder="Quality, certifications, labels, etc. · ልዩ ፍላጎቶችዎ"
                  value={form.special_requirements} onChange={e => upd("special_requirements", e.target.value)} />
              </F>
            </div>

            {/* Info strip */}
            <div className="bg-[#1B5E20]/5 border border-[#1B5E20]/15 rounded-xl p-3 text-xs text-muted-foreground">
              <span className="font-bold text-[#1B5E20]">Note:</span> We deliver by <strong>road transport within Ethiopia only</strong>. Country is set to Ethiopia by default.
              <span className="block text-[#D89C2B]/80 mt-0.5">ልኬቱ በሀገር ውስጥ የምድር ጭነት ብቻ ነው። ሀገር ኢትዮጵያ ነው።</span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel · ሰርዝ</Button>
              <Button type="submit" className="flex-grow" disabled={isLoading}>
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing…</>
                  : <><ShoppingBag className="w-4 h-4" /> Place Order · ትዕዛዝ ያስገቡ</>}
              </Button>
            </div>

          </form>
        )}
      </motion.div>
    </div>
  );
}
