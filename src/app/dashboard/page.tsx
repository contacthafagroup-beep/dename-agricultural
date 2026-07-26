"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, FileText, CreditCard, Clock, CheckCircle, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import type { Order, Profile } from "@/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: prof }, { data: ord }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("orders").select("*, product:products(name, grade, images)")
          .eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
      ]);
      setProfile(prof);
      setOrders(ord ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const stats = [
    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Pending Review", value: orders.filter(o => o.status === "pending_review").length, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "Active Orders", value: orders.filter(o => !["delivered","cancelled"].includes(o.status)).length, icon: Package, color: "bg-purple-50 text-purple-600" },
    { label: "Completed", value: orders.filter(o => o.status === "delivered").length, icon: CheckCircle, color: "bg-green-50 text-[#1B5E20]" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-primary rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}! 👋
        </h2>
        <p className="text-white/80 mt-1 text-sm">
          {profile?.company_name ? `${profile.company_name} · ` : ""}
          Browse our products and place your order — we deliver to your warehouse.
        </p>
        <div className="flex gap-3 mt-4">
          <Link href="/products">
            <Button variant="white" size="sm">Browse Products</Button>
          </Link>
          <Link href="/contact">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
              Contact Support
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-border">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Orders</h3>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="text-[#1B5E20]">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No orders yet</p>
            <Link href="/products" className="mt-3 inline-block">
              <Button size="sm">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#1B5E20]/10 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-[#1B5E20]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {order.order_number}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.quantity} {order.unit} · {formatDate(order.created_at)}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/products", icon: Package, label: "Buy New Product", desc: "Browse our 8 product categories" },
          { href: "/dashboard/quotations", icon: FileText, label: "My Quotations from Dename", desc: "View pricing we sent you" },
          { href: "/dashboard/payments", icon: CreditCard, label: "Pay for Your Order", desc: "Submit payment to confirm your order" },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-border hover:border-[#1B5E20]/40 hover:shadow-md transition-all cursor-pointer group">
              <action.icon className="w-6 h-6 text-[#1B5E20] mb-3" />
              <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-[#1B5E20] transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
