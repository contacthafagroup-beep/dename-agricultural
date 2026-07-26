"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Users, CreditCard, Package, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import Link from "next/link";

interface Stats {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_customers: number;
  unverified_payments: number;
  unread_messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total_orders: 0, pending_orders: 0, completed_orders: 0, total_customers: 0, unverified_payments: 0, unread_messages: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [
        { count: totalOrders },
        { count: pendingOrders },
        { count: completedOrders },
        { count: totalCustomers },
        { count: unverifiedPayments },
        { count: unreadMessages },
        { data: recent },
      ] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending_review"),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "delivered"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "exporter"),
        supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "submitted"),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("orders").select("*, profile:profiles(full_name, company_name)").order("created_at", { ascending: false }).limit(8),
      ]);

      setStats({
        total_orders: totalOrders ?? 0, pending_orders: pendingOrders ?? 0,
        completed_orders: completedOrders ?? 0, total_customers: totalCustomers ?? 0,
        unverified_payments: unverifiedPayments ?? 0, unread_messages: unreadMessages ?? 0,
      });
      setRecentOrders(recent ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Total Orders", value: stats.total_orders, icon: ShoppingBag, color: "bg-blue-500", link: "/admin/orders" },
    { label: "Pending Review", value: stats.pending_orders, icon: Clock, color: "bg-amber-500", link: "/admin/orders?status=pending_review" },
    { label: "Completed", value: stats.completed_orders, icon: CheckCircle, color: "bg-green-600", link: "/admin/orders?status=delivered" },
    { label: "Customers", value: stats.total_customers, icon: Users, color: "bg-purple-500", link: "/admin/customers" },
    { label: "Payments to Verify", value: stats.unverified_payments, icon: CreditCard, color: "bg-orange-500", link: "/admin/payments" },
    { label: "Unread Messages", value: stats.unread_messages, icon: AlertCircle, color: "bg-red-500", link: "/admin/messages" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage orders coming in from your buyers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}>
            <Link href={card.link}
              className="block bg-white dark:bg-gray-800 rounded-2xl p-4 border border-border hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Customer Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Customer Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[#1B5E20] font-medium hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50 dark:bg-gray-700/50">
                {["Order #", "Customer", "Product", "Quantity", "Status", "Date"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-semibold text-[#1B5E20] hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{order.profile?.full_name ?? order.contact_person}</div>
                    <div className="text-xs text-muted-foreground">{order.profile?.company_name ?? order.company_name}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{order.grade}</td>
                  <td className="px-4 py-3 font-medium">{order.quantity} {order.unit}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(order.created_at)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
