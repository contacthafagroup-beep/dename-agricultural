"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Download, RefreshCw, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate, generateInvoiceNumber } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    order_id: "", tax_rate: "0", due_date: "", payment_status: "unpaid" as "unpaid" | "partial" | "paid",
  });
  const supabase = createClient();

  async function load() {
    const [{ data: inv }, { data: ord }] = await Promise.all([
      supabase.from("invoices").select("*, order:orders(order_number, company_name, grade, quantity, unit)")
        .order("created_at", { ascending: false }),
      supabase.from("orders").select("*, profile:profiles(full_name, company_name, email, address)")
        .in("status", ["payment_verified", "preparing", "packaging", "dispatched", "delivered"]),
    ]);
    setInvoices(inv ?? []);
    setOrders(ord ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const handleCreateInvoice = async () => {
    if (!form.order_id) { toast.error("Select an order"); return; }
    const order = orders.find(o => o.id === form.order_id);
    if (!order) return;

    setSaving(true);
    const taxRate = parseFloat(form.tax_rate) || 0;

    // Get quotation for pricing
    const { data: quot } = await supabase.from("quotations").select("total, unit_price")
      .eq("order_id", form.order_id).maybeSingle();

    const subtotal = quot?.total ?? (order.quantity * (order.price_per_unit ?? 0));
    const taxAmount = subtotal * (taxRate / 100);
    const grandTotal = subtotal + taxAmount;

    const { error } = await supabase.from("invoices").insert({
      invoice_number: generateInvoiceNumber(),
      order_id: form.order_id,
      customer_name: order.profile?.full_name ?? order.contact_person,
      customer_email: order.email,
      customer_company: order.profile?.company_name ?? order.company_name,
      customer_address: order.address,
      items: [{ description: `${order.grade} — ${order.quantity} ${order.unit}`, quantity: order.quantity, unit: order.unit, unit_price: quot?.unit_price ?? 0, total: subtotal }],
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      payment_status: form.payment_status,
      due_date: form.due_date || null,
    });

    setSaving(false);
    if (error) { toast.error("Failed to create invoice"); return; }
    toast.success("Invoice created!");
    setShowForm(false);
    setForm({ order_id: "", tax_rate: "0", due_date: "", payment_status: "unpaid" });
    load();
  };

  const payBadge = (s: string) => ({ unpaid: "bg-red-100 text-red-700", partial: "bg-amber-100 text-amber-700", paid: "bg-green-100 text-green-700" }[s] ?? "bg-gray-100 text-gray-600");

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-muted-foreground text-sm">{invoices.length} total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
          <Button size="sm" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Generate Invoice</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50 dark:bg-gray-700/50">
                {["Invoice #", "Customer", "Order", "Amount", "Status", "Due Date", "Created", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv, i) => (
                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[#1B5E20]">{inv.invoice_number}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{inv.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{inv.customer_company}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{inv.order?.order_number ?? "—"}</td>
                  <td className="px-4 py-3 font-bold text-[#1B5E20] whitespace-nowrap">{formatCurrency(inv.grand_total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${payBadge(inv.payment_status)}`}>
                      {inv.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{inv.due_date ? formatDate(inv.due_date) : "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(inv.created_at)}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      <Download className="w-3 h-3 mr-1" /> PDF
                    </Button>
                  </td>
                </motion.tr>
              ))}
              {invoices.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">No invoices yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-lg">Generate Invoice</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label>Order *</Label>
                <Select onValueChange={v => setForm(p => ({ ...p, order_id: v }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a verified order" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map(o => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.order_number} — {o.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tax Rate (%)</Label>
                <Input type="number" className="mt-1" value={form.tax_rate}
                  onChange={e => setForm(p => ({ ...p, tax_rate: e.target.value }))} placeholder="0" />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" className="mt-1" value={form.due_date}
                  onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} />
              </div>
              <div>
                <Label>Payment Status</Label>
                <Select value={form.payment_status} onValueChange={v => setForm(p => ({ ...p, payment_status: v as "unpaid" | "partial" | "paid" }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleCreateInvoice} disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : <><FileText className="w-4 h-4" /> Create Invoice</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
