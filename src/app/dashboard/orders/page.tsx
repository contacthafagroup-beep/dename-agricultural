"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Package, ArrowRight, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/types";

const ORDER_STEPS = [
  "pending_review", "quotation_sent", "quotation_accepted",
  "awaiting_payment", "payment_submitted", "payment_verified",
  "preparing", "packaging", "dispatched", "delivered",
];

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = ORDER_STEPS.indexOf(status);
  return (
    <div className="mt-4">
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {ORDER_STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs
              ${i < currentIdx ? "bg-[#1B5E20] text-white"
              : i === currentIdx ? "bg-[#D89C2B] text-white ring-4 ring-[#D89C2B]/20"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400"}`}>
              {i < currentIdx ? "✓" : i + 1}
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div className={`flex-1 min-w-4 h-0.5 ${i < currentIdx ? "bg-[#1B5E20]" : "bg-gray-200 dark:bg-gray-700"}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Current: <span className="font-semibold text-[#D89C2B]">{getStatusLabel(status)}</span>
      </p>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("orders")
        .select("*, product:products(name, grade, images)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.grade.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders from Dename</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{orders.length} orders placed with Dename</p>
        </div>
        <Link href="/products">
          <Button><Package className="w-4 h-4" /> Order New Product</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search orders…" className="pl-10"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "pending_review", "quotation_sent", "awaiting_payment", "delivered"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterStatus === s ? "bg-[#1B5E20] text-white" : "bg-muted hover:bg-muted/80"}`}>
              {s === "all" ? "All" : getStatusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No orders found</h3>
          <p className="text-muted-foreground text-sm mb-6">
            {orders.length === 0 ? "You haven't ordered from Dename yet." : "No orders match your filters."}
          </p>
          <Link href="/products"><Button>Browse Products</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, i) => (
            <motion.div key={order.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{order.order_number}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.quantity} {order.unit} · {order.grade} · {order.packaging}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Placed: {formatDate(order.created_at)} · Destination: {order.delivery_destination}
                  </p>
                </div>
                <Link href={`/dashboard/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View Details <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
              <OrderTimeline status={order.status} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
