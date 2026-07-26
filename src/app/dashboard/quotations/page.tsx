"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusLabel, formatDate, formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Quotation } from "@/types";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("quotations")
        .select("*, order:orders!inner(user_id, company_name, delivery_destination)")
        .eq("order.user_id", user.id)
        .order("created_at", { ascending: false });
      setQuotations(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const handleAction = async (id: string, action: "accepted" | "rejected") => {
    const { error } = await supabase.from("quotations").update({ status: action }).eq("id", id);
    if (error) { toast.error("Action failed"); return; }
    setQuotations((prev) => prev.map((q) => q.id === id ? { ...q, status: action } : q));
    if (action === "accepted") {
      // update order status too
      const q = quotations.find((x) => x.id === id);
      if (q?.order_id) {
        await supabase.from("orders").update({ status: "quotation_accepted" }).eq("id", q.order_id);
      }
      toast.success("Quotation accepted! Proceed to payment.");
    } else {
      toast.info("Quotation rejected.");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotations</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Review pricing sent to you by Dename Agricultural Supplier</p>
      </div>

      {quotations.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-16 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No quotations yet</h3>
          <p className="text-muted-foreground text-sm">
            After submitting an order request, our team will send you a quotation within 24–48 hours.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotations.map((q, i) => (
            <motion.div key={q.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-border flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-900 dark:text-white">{q.quotation_number}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      q.status === "sent" ? "bg-blue-100 text-blue-700" :
                      q.status === "accepted" ? "bg-green-100 text-green-700" :
                      q.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"}`}>
                      {q.status.charAt(0).toUpperCase() + q.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {q.product_name} · {q.quantity} {q.unit} · Issued {formatDate(q.created_at)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-[#1B5E20]">{formatCurrency(q.total)}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Unit Price</p>
                  <p className="font-semibold">{formatCurrency(q.unit_price)}/{q.unit}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Transport Cost</p>
                  <p className="font-semibold">{formatCurrency(q.transportation_cost)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tax ({q.tax_rate}%)</p>
                  <p className="font-semibold">{formatCurrency(q.tax_amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Validity</p>
                  <p className="font-semibold">{q.validity_period}</p>
                </div>
              </div>

              {q.notes && (
                <div className="px-5 pb-4">
                  <p className="text-xs text-muted-foreground bg-muted rounded-lg p-3">{q.notes}</p>
                </div>
              )}

              {/* Actions */}
              {q.status === "sent" && (
                <div className="p-4 border-t border-border flex gap-3 bg-gray-50 dark:bg-gray-800/50">
                  <Button className="flex-1" onClick={() => handleAction(q.id, "accepted")}>
                    <CheckCircle className="w-4 h-4" /> Accept &amp; Proceed to Payment
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleAction(q.id, "rejected")}>
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                </div>
              )}
              {q.status === "accepted" && (
                <div className="p-4 border-t border-border bg-green-50 dark:bg-green-900/10 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Accepted — proceed to <a href="/dashboard/payments" className="font-semibold underline">make payment</a>
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
