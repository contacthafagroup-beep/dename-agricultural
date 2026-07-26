"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, Calendar, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getStatusColor, getStatusLabel, formatDate } from "@/lib/utils";
import { OrderRequestForm } from "@/components/orders/order-request-form";
import type { Order } from "@/types";

const ORDER_STEPS = [
  { key: "pending_review", label: "Order Received" },
  { key: "quotation_sent", label: "Quotation Sent" },
  { key: "quotation_accepted", label: "Quotation Accepted" },
  { key: "awaiting_payment", label: "Awaiting Payment" },
  { key: "payment_submitted", label: "Payment Submitted" },
  { key: "payment_verified", label: "Payment Verified" },
  { key: "preparing", label: "Preparing Order" },
  { key: "packaging", label: "Packaging" },
  { key: "dispatched", label: "Dispatched" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("orders")
        .select("*, product:products(*)")
        .eq("id", id)
        .single();
      setOrder(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  if (!order) return (
    <div className="text-center py-20">
      <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <p className="font-semibold text-lg">Order not found</p>
      <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  const currentStep = ORDER_STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-[#1B5E20] transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{order.order_number}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Placed on {formatDate(order.created_at)}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>

        {/* Order Timeline */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Order Progress</h3>
          <div className="space-y-3">
            {ORDER_STEPS.map((step, i) => {
              const isCompleted = i < currentStep;
              const isCurrent = i === currentStep;
              const isPending = i > currentStep;
              return (
                <motion.div key={step.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all
                    ${isCompleted ? "bg-[#1B5E20] text-white" :
                      isCurrent ? "bg-[#D89C2B] text-white ring-4 ring-[#D89C2B]/25" :
                      "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${isCurrent ? "text-[#D89C2B]" : isCompleted ? "text-gray-900 dark:text-white" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                    {isCurrent && <span className="ml-2 text-xs bg-[#D89C2B]/15 text-[#D89C2B] px-2 py-0.5 rounded-full">Current</span>}
                  </div>
                  {i < ORDER_STEPS.length - 1 && (
                    <div className="absolute left-[13px] mt-7" style={{ height: "20px", width: "2px", background: isCompleted ? "#1B5E20" : "#e5e7eb" }} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#1B5E20]" /> Product Details
          </h3>
          <div className="space-y-2 text-sm">
            {[
              ["Grade", order.grade],
              ["Quantity", `${order.quantity} ${order.unit}`],
              ["Packaging", order.packaging],
              ["Shipping Method", order.shipping_method],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#1B5E20]" /> Delivery Details
          </h3>
          <div className="space-y-2 text-sm">
            {[
              ["Destination", order.delivery_destination],
              ["Preferred Date", order.preferred_delivery_date ? formatDate(order.preferred_delivery_date) : "—"],
              ["Country", order.country],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5 md:col-span-2">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1B5E20]" /> Contact Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[
              ["Company", order.company_name],
              ["Contact Person", order.contact_person],
              ["Email", order.email],
              ["Phone", order.phone],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
          {order.special_requirements && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Special Requirements</p>
              <p className="text-sm">{order.special_requirements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
