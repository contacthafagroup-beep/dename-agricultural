"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const METHOD_LABELS: Record<string, string> = {
  commercial_bank_ethiopia: "CBE", awash_bank: "Awash Bank",
  dashen_bank: "Dashen Bank", bank_of_abyssinia: "Bank of Abyssinia",
  telebirr: "Telebirr", swift_transfer: "SWIFT", wire_transfer: "Wire Transfer",
  letter_of_credit: "L/C", wise: "Wise",
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("payments")
      .select("*, order:orders(order_number, company_name, quantity, unit, grade)")
      .order("created_at", { ascending: false });
    setPayments(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const verifyPayment = async (id: string, orderId: string, approve: boolean) => {
    const newStatus = approve ? "verified" : "rejected";
    await supabase.from("payments").update({ status: newStatus, admin_notes: notes[id] ?? "" }).eq("id", id);
    if (approve) {
      await supabase.from("orders").update({ status: "payment_verified" }).eq("id", orderId);
    }
    toast.success(approve ? "Payment verified!" : "Payment rejected");
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const pending = payments.filter(p => p.status === "submitted");
  const processed = payments.filter(p => p.status !== "submitted");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-muted-foreground text-sm">{pending.length} pending verification</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /> Refresh</Button>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-bold text-amber-600 mb-3">⏳ Pending Verification ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-amber-200 dark:border-amber-700 p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {METHOD_LABELS[p.payment_method] ?? p.payment_method}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Order: {p.order?.order_number} · {p.order?.quantity} {p.order?.unit} · {p.order?.company_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Submitted: {formatDate(p.created_at)}
                      {p.transaction_reference && ` · Ref: ${p.transaction_reference}`}
                    </p>
                  </div>
                  {p.receipt_url && (
                    <a href={p.receipt_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm"><ExternalLink className="w-3.5 h-3.5" /> Receipt</Button>
                    </a>
                  )}
                </div>
                <Textarea placeholder="Admin notes (optional)…" rows={2} className="mb-3 text-sm"
                  value={notes[p.id] ?? ""} onChange={e => setNotes(prev => ({ ...prev, [p.id]: e.target.value }))} />
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => verifyPayment(p.id, p.order_id, true)}>
                    <CheckCircle className="w-4 h-4" /> Approve Payment
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => verifyPayment(p.id, p.order_id, false)}>
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Processed */}
      <div>
        <h2 className="font-bold text-gray-900 dark:text-white mb-3">Payment History</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50 dark:bg-gray-700/50">
                {["Order", "Method", "Reference", "Date", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {processed.map(p => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{p.order?.order_number ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">{METHOD_LABELS[p.payment_method] ?? p.payment_method}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.transaction_reference ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                      ${p.status === "verified" ? "bg-green-100 text-green-700" : p.status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {processed.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No processed payments</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
