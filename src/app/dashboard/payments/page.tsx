"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Upload, CheckCircle, Clock, AlertCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { toast } from "sonner";
import type { Order, Payment } from "@/types";

const PAYMENT_METHODS = [
  { value: "commercial_bank_ethiopia", label: "Commercial Bank of Ethiopia" },
  { value: "awash_bank", label: "Awash Bank" },
  { value: "dashen_bank", label: "Dashen Bank" },
  { value: "bank_of_abyssinia", label: "Bank of Abyssinia" },
  { value: "telebirr", label: "Telebirr" },
  { value: "swift_transfer", label: "SWIFT Transfer" },
  { value: "wire_transfer", label: "Wire Transfer" },
  { value: "letter_of_credit", label: "Letter of Credit (L/C)" },
  { value: "wise", label: "Wise (TransferWise)" },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [awaitingOrders, setAwaitingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [txRef, setTxRef] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: pay }, { data: ord }] = await Promise.all([
        supabase.from("payments")
          .select("*, order:orders(order_number, grade, quantity, unit)")
          .order("created_at", { ascending: false }),
        supabase.from("orders")
          .select("*")
          .eq("user_id", user.id)
          .in("status", ["quotation_accepted", "awaiting_payment"]),
      ]);
      setPayments(pay ?? []);
      setAwaitingOrders(ord ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !paymentMethod) { toast.error("Please fill all required fields"); return; }
    setSubmitting(true);

    try {
      let receiptUrl = "";
      if (receiptFile) {
        const ext = receiptFile.name.split(".").pop();
        const path = `receipts/${selectedOrder}/${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("payment-receipts")
          .upload(path, receiptFile);
        if (uploadErr) throw uploadErr;
        const { data: { publicUrl } } = supabase.storage.from("payment-receipts").getPublicUrl(path);
        receiptUrl = publicUrl;
      }

      const order = awaitingOrders.find(o => o.id === selectedOrder);
      const { error } = await supabase.from("payments").insert({
        order_id: selectedOrder,
        amount: 0, // will be set by admin from quotation
        currency: "USD",
        payment_method: paymentMethod,
        transaction_reference: txRef,
        receipt_url: receiptUrl,
        status: "submitted",
      });

      if (error) throw error;

      await supabase.from("orders").update({ status: "payment_submitted" }).eq("id", selectedOrder);

      toast.success("Payment submitted! Admin will verify shortly.");
      setShowForm(false);
      setSelectedOrder(""); setPaymentMethod(""); setTxRef(""); setReceiptFile(null);

      // Reload
      const { data: newPay } = await supabase.from("payments")
        .select("*, order:orders(order_number, grade, quantity, unit)")
        .order("created_at", { ascending: false });
      setPayments(newPay ?? []);
    } catch (err) {
      toast.error("Failed to Submit My Payment");
    } finally {
      setSubmitting(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === "verified") return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (status === "rejected") return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-amber-600" />;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Pay for your orders from Dename Agricultural Supplier</p>
        </div>
        {awaitingOrders.length > 0 && (
          <Button onClick={() => setShowForm(true)}>
            <Upload className="w-4 h-4" /> Submit My Payment
          </Button>
        )}
      </div>

      {/* Payment form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-lg">Submit My Payment</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitPayment} className="p-5 space-y-4">
              <div>
                <Label>Order *</Label>
                <Select onValueChange={setSelectedOrder}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select order awaiting payment" />
                  </SelectTrigger>
                  <SelectContent>
                    {awaitingOrders.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.order_number} — {o.quantity} {o.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Method *</Label>
                <Select onValueChange={setPaymentMethod}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="txRef">Transaction Reference / ID</Label>
                <Input id="txRef" placeholder="e.g. TXN123456789" className="mt-1"
                  value={txRef} onChange={(e) => setTxRef(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="receipt">Payment Receipt (optional)</Label>
                <input id="receipt" type="file" accept="image/*,.pdf"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1B5E20] file:text-white file:cursor-pointer" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : "Submit My Payment"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Payments list */}
      {payments.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-16 text-center">
          <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No payments yet</h3>
          <p className="text-muted-foreground text-sm">
            Accept the quotation from Dename first, then submit your payment proof here. We verify and confirm your order.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {statusIcon(p.status)}
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                      {PAYMENT_METHODS.find(m => m.value === p.payment_method)?.label ?? p.payment_method}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(p.created_at)}
                      {p.transaction_reference && ` · Ref: ${p.transaction_reference}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}>
                    {getStatusLabel(p.status)}
                  </span>
                </div>
              </div>
              {p.admin_notes && (
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                  Admin note: {p.admin_notes}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
