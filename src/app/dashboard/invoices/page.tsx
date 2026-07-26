"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/types";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("invoices")
        .select("*, order:orders!inner(user_id)")
        .eq("order.user_id", user.id)
        .order("created_at", { ascending: false });
      setInvoices(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const payBadge = (s: string) => {
    const map: Record<string, string> = {
      unpaid: "bg-red-100 text-red-700",
      partial: "bg-amber-100 text-amber-700",
      paid: "bg-green-100 text-green-700",
    };
    return map[s] ?? "bg-gray-100 text-gray-700";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Download invoices for your purchases from Dename Agricultural Supplier</p>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-16 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No invoices yet</h3>
          <p className="text-muted-foreground text-sm">
            Dename will generate your invoice after verifying your payment. You can download it here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden">
          <div className="hidden sm:grid grid-cols-5 p-4 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Invoice #</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
          {invoices.map((inv, i) => (
            <motion.div key={inv.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="p-4 border-b border-border last:border-0 sm:grid sm:grid-cols-5 sm:items-center hover:bg-muted/30 transition-colors space-y-2 sm:space-y-0">
              <div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{inv.invoice_number}</p>
                <p className="text-xs text-muted-foreground sm:hidden">{inv.customer_company}</p>
              </div>
              <p className="text-sm text-muted-foreground">{formatDate(inv.created_at)}</p>
              <div>
                <p className="font-bold text-[#1B5E20]">{formatCurrency(inv.grand_total)}</p>
                {inv.tax_amount > 0 && (
                  <p className="text-xs text-muted-foreground">incl. {formatCurrency(inv.tax_amount)} tax</p>
                )}
              </div>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize w-fit ${payBadge(inv.payment_status)}`}>
                {inv.payment_status}
              </span>
              <div className="flex sm:justify-end">
                <Button variant="outline" size="sm"
                  onClick={() => window.open(`/api/invoices/${inv.id}/pdf`, "_blank")}>
                  <Download className="w-3.5 h-3.5" /> PDF
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Invoices are generated after payment verification. Contact{" "}
          <a href="mailto:contact.dename@gmail.com" className="font-semibold underline">contact.dename@gmail.com</a>
          {" "}for any corrections.
        </p>
      </div>
    </div>
  );
}
