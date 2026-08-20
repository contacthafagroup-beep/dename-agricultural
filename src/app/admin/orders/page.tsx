"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import { toast } from "sonner";

const ALL_STATUSES = [
  "pending_review", "quotation_sent", "quotation_accepted", "awaiting_payment",
  "payment_submitted", "payment_verified", "preparing", "packaging", "dispatched", "delivered", "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("orders")
      .select("*, profile:profiles(full_name, company_name, email)")
      .order("created_at", { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      (o.profile?.company_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (o.profile?.full_name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (error) { toast.error("Update failed"); } else { toast.success("Status updated"); await load(); }
    setUpdating(null);
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-muted-foreground text-sm">{orders.length} orders placed by buyers</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /> Refresh</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search orders, companies…" className="pl-10"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ALL_STATUSES.map(s => <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50 dark:bg-gray-700/50">
                {["Order #", "Customer", "Product", "Qty", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[#1B5E20]">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{order.profile?.full_name ?? order.contact_person}</div>
                    <div className="text-xs text-muted-foreground">{order.profile?.company_name ?? order.company_name}</div>
                    {order.special_requirements?.includes("MEDIA ORDER") && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">🎙️ MEDIA</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{order.grade}</td>
                  <td className="px-4 py-3 font-medium text-xs whitespace-nowrap">{order.quantity} {order.unit}</td>
                  <td className="px-4 py-3">
                    <Select value={order.status} onValueChange={v => updateStatus(order.id, v)}
                      disabled={updating === order.id}>
                      <SelectTrigger className={`h-7 text-xs border-none rounded-full px-2.5 w-auto ${getStatusColor(order.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_STATUSES.map(s => <SelectItem key={s} value={s} className="text-xs">{getStatusLabel(s)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Link href={`/admin/orders/${order.id}`}><Eye className="w-3.5 h-3.5" /></Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
