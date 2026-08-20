"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, RefreshCw, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("quotations")
      .select("*, order:orders(order_number, company_name, grade, quantity, unit, user_id, profile:profiles(full_name))")
      .order("created_at", { ascending: false });
    setQuotations(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      sent: "bg-blue-100 text-blue-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      expired: "bg-gray-100 text-gray-600",
    };
    return map[s] ?? "bg-gray-100 text-gray-600";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotations</h1>
          <p className="text-muted-foreground text-sm">{quotations.length} total</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /> Refresh</Button>
      </div>

      {quotations.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border p-16 text-center">
          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No quotations yet. Create one from an order.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50 dark:bg-gray-700/50">
                  {["Quotation #", "Order", "Customer", "Product", "Qty", "Total", "Status", "Date", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quotations.map((q, i) => (
                  <motion.tr key={q.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#1B5E20]">{q.quotation_number}</td>
                    <td className="px-4 py-3 text-xs font-mono">{q.order?.order_number ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{q.order?.profile?.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{q.order?.company_name ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">{q.product_name}</td>
                    <td className="px-4 py-3 text-xs font-medium whitespace-nowrap">{q.quantity} {q.unit}</td>
                    <td className="px-4 py-3 font-bold text-[#1B5E20] whitespace-nowrap">{formatCurrency(q.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(q.status)}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(q.created_at)}</td>
                    <td className="px-4 py-3">
                      <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Link href={`/admin/orders/${q.order_id}`}>
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
