"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { formatDate, getStatusColor, getStatusLabel, generateQuotationNumber } from "@/lib/utils";
import { toast } from "sonner";

const ALL_STATUSES = [
  "pending_review", "quotation_sent", "quotation_accepted", "awaiting_payment",
  "payment_submitted", "payment_verified", "preparing", "packaging", "dispatched", "delivered", "cancelled",
];

export default function AdminOrderDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [qForm, setQForm] = useState({
    unit_price: "", transportation_cost: "0", tax_rate: "0", delivery_time: "2-4 weeks", validity_period: "30 days", notes: "",
  });
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [{ data: ord }, { data: quot }] = await Promise.all([
        supabase.from("orders").select("*, profile:profiles(*)").eq("id", id).single(),
        supabase.from("quotations").select("*").eq("order_id", id).maybeSingle(),
      ]);
      setOrder(ord);
      setQuotation(quot);
      setLoading(false);
    }
    load();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    setOrder((p: any) => ({ ...p, status: newStatus }));
    toast.success("Status updated");
  };

  const createQuotation = async () => {
    if (!qForm.unit_price) { toast.error("Enter unit price"); return; }
    const qty = order.quantity;
    const unitPrice = parseFloat(qForm.unit_price);
    const transport = parseFloat(qForm.transportation_cost);
    const taxRate = parseFloat(qForm.tax_rate);
    const subtotal = qty * unitPrice + transport;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const { data, error } = await supabase.from("quotations").insert({
      quotation_number: generateQuotationNumber(),
      order_id: id,
      product_name: order.grade,
      quantity: qty,
      unit: order.unit,
      unit_price: unitPrice,
      transportation_cost: transport,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      subtotal,
      total,
      delivery_time: qForm.delivery_time,
      validity_period: qForm.validity_period,
      notes: qForm.notes,
      status: "sent",
    }).select().single();

    if (error) { toast.error("Failed to create quotation"); return; }
    await supabase.from("orders").update({ status: "quotation_sent" }).eq("id", id);
    setQuotation(data);
    setOrder((p: any) => ({ ...p, status: "quotation_sent" }));
    setShowQuoteForm(false);
    toast.success("Quotation created and sent!");
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;
  if (!order) return <div className="text-center py-20"><p className="font-semibold">Order not found</p></div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{order.order_number}</h1>
          <p className="text-muted-foreground text-sm">Received {formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={order.status} onValueChange={updateStatus}>
            <SelectTrigger className={`h-9 text-xs rounded-full px-3 w-auto ${getStatusColor(order.status)}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{getStatusLabel(s)}</SelectItem>)}
            </SelectContent>
          </Select>
          {!quotation && (
            <Button size="sm" onClick={() => setShowQuoteForm(true)}>
              <FileText className="w-4 h-4" /> Create Quotation
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Customer */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border p-5">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-muted-foreground">Customer</h3>
          <div className="space-y-2 text-sm">
            {[
              ["Name", order.profile?.full_name ?? order.contact_person],
              ["Company", order.profile?.company_name ?? order.company_name],
              ["Email", order.email],
              ["Phone", order.phone],
              ["WhatsApp", order.whatsapp ?? "—"],
              ["Country", order.country],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">{l}</span>
                <span className="font-medium text-right">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border p-5">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-muted-foreground">Order Details</h3>
          <div className="space-y-2 text-sm">
            {[
              ["Grade", order.grade],
              ["Quantity", `${order.quantity} ${order.unit}`],
              ["Packaging", order.packaging],
              ["Shipping", order.shipping_method],
              ["Destination", order.delivery_destination],
              ["Preferred Date", order.preferred_delivery_date ? formatDate(order.preferred_delivery_date) : "—"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between gap-4">
                <span className="text-muted-foreground shrink-0">{l}</span>
                <span className="font-medium text-right">{v}</span>
              </div>
            ))}
          </div>
          {order.special_requirements && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Special Requirements</p>
              <p className="text-sm bg-muted rounded-lg p-2">{order.special_requirements}</p>
            </div>
          )}
        </div>
      </div>

      {/* Media Attachments — shown when buyer submitted a media order */}
      {order.special_requirements && order.special_requirements.includes("MEDIA ORDER") && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-700 p-5">
          <h3 className="font-bold mb-4 text-amber-800 dark:text-amber-400 flex items-center gap-2">
            🎙️ Media Order Attachments
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
            This order was submitted via media. Review the attached files below.
          </p>
          {/* Extract URLs from special_requirements */}
          {(() => {
            const urls = order.special_requirements.match(/https?:\/\/[^\s,|]+/g) ?? [];
            if (urls.length === 0) return (
              <p className="text-xs text-muted-foreground">No media URLs found in this order.</p>
            );
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {urls.map((url: string, i: number) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                  const isVideo = /\.(mp4|webm|mov)$/i.test(url) || url.includes("video");
                  const isAudio = /\.(mp3|wav|ogg|webm)$/i.test(url) || url.includes("audio");
                  return (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-border overflow-hidden">
                      {isImage && (
                        <img src={url} alt={`Media ${i+1}`} className="w-full h-40 object-cover" />
                      )}
                      {isVideo && (
                        <video src={url} controls className="w-full h-40 bg-black" />
                      )}
                      {isAudio && (
                        <div className="p-4">
                          <p className="text-xs text-muted-foreground mb-2">🎙️ Voice Recording {i+1}</p>
                          <audio src={url} controls className="w-full" />
                        </div>
                      )}
                      {!isImage && !isVideo && !isAudio && (
                        <div className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 text-lg">📎</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">File {i+1}</p>
                            <a href={url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-[#1B5E20] hover:underline">
                              View / Download
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
          <p className="text-xs text-amber-600 mt-4 font-semibold">
            Note: Contact the buyer at {order.phone} to discuss their order requirements before creating a quotation.
          </p>
        </div>
      )}

      {/* Quotation */}
      {quotation && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-[#1B5E20]/30 p-5">
          <h3 className="font-bold mb-4 text-[#1B5E20]">Quotation — {quotation.quotation_number}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {[
              ["Unit Price", `$${quotation.unit_price}/${quotation.unit}`],
              ["Transport Cost", `$${quotation.transportation_cost}`],
              ["Tax", `${quotation.tax_rate}% ($${quotation.tax_amount.toFixed(2)})`],
              ["Total", `$${quotation.total.toFixed(2)}`],
              ["Delivery Time", quotation.delivery_time],
              ["Validity", quotation.validity_period],
              ["Status", quotation.status],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-xs text-muted-foreground">{l}</p>
                <p className="font-semibold mt-0.5 capitalize">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quotation form */}
      {showQuoteForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-lg font-bold mb-4">Create Quotation</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Unit Price (USD/{order.unit}) *</Label>
                  <Input type="number" placeholder="e.g. 850" className="mt-1"
                    value={qForm.unit_price} onChange={e => setQForm(p => ({ ...p, unit_price: e.target.value }))} />
                </div>
                <div>
                  <Label>Transport Cost (USD)</Label>
                  <Input type="number" placeholder="0" className="mt-1"
                    value={qForm.transportation_cost} onChange={e => setQForm(p => ({ ...p, transportation_cost: e.target.value }))} />
                </div>
                <div>
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" placeholder="0" className="mt-1"
                    value={qForm.tax_rate} onChange={e => setQForm(p => ({ ...p, tax_rate: e.target.value }))} />
                </div>
                <div>
                  <Label>Delivery Time</Label>
                  <Input placeholder="2-4 weeks" className="mt-1"
                    value={qForm.delivery_time} onChange={e => setQForm(p => ({ ...p, delivery_time: e.target.value }))} />
                </div>
                <div>
                  <Label>Validity Period</Label>
                  <Input placeholder="30 days" className="mt-1"
                    value={qForm.validity_period} onChange={e => setQForm(p => ({ ...p, validity_period: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Notes (optional)</Label>
                <Textarea placeholder="Additional terms or conditions…" className="mt-1"
                  value={qForm.notes} onChange={e => setQForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              {qForm.unit_price && (
                <div className="bg-[#1B5E20]/10 rounded-xl p-3 text-sm">
                  <p className="font-bold text-[#1B5E20]">
                    Estimated Total: ${(order.quantity * parseFloat(qForm.unit_price || "0") + parseFloat(qForm.transportation_cost || "0")).toFixed(2)} USD
                  </p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowQuoteForm(false)}>Cancel</Button>
                <Button className="flex-1" onClick={createQuotation}><Send className="w-4 h-4" /> Send Quotation</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
