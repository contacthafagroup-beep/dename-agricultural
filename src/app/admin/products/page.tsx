"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import { toast } from "sonner";
import { STATIC_CATEGORIES } from "@/types";
import type { Product } from "@/types";

const UNITS = ["MT", "KG", "Liter", "Drum", "Bag"];

const emptyProduct = {
  name: "", grade: "", origin: "Hadiya Zone, Ethiopia",
  available_quantity: 0, unit: "MT", packaging: "",
  harvest_date: "", moisture_level: 0, color: "", size: "",
  minimum_order: 1, delivery_time: "2-4 weeks",
  export_standard: "EU, US, Asian Markets", description: "",
  status: "available" as const, price_per_unit: 0,
  sub_category: "", growing_region: "Hadiya Zone",
  harvest_season: "", storage_conditions: "",
  quality_standards: "", export_readiness: "Export Ready",
  is_organic: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const supabase = createClient();

  async function load() {
    const { data } = await supabase
      .from("products")
      .select("*, category:product_categories(name, slug, icon)")
      .order("created_at", { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditProduct({ ...emptyProduct }); setShowForm(true); };
  const openEdit = (p: Product) => { setEditProduct({ ...p }); setShowForm(true); };

  const handleSave = async () => {
    if (!editProduct?.name || !editProduct.grade) { toast.error("Name and grade are required"); return; }
    setSaving(true);
    if (editProduct.id) {
      const { error } = await supabase.from("products").update(editProduct).eq("id", editProduct.id);
      if (error) { toast.error("Update failed"); } else { toast.success("Product updated"); }
    } else {
      const { error } = await supabase.from("products").insert({ ...editProduct, images: [] });
      if (error) { toast.error("Create failed"); } else { toast.success("Product created"); }
    }
    setSaving(false);
    setShowForm(false);
    setEditProduct(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast.success("Product deleted");
    load();
  };

  const upd = (k: string, v: unknown) => setEditProduct(p => p ? ({ ...p, [k]: v }) : p);

  const filtered = products.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.grade.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || (p as any).category?.slug === filterCat;
    return matchSearch && matchCat;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-muted-foreground text-sm">{products.length} products available for buyers to order</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Product</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products…" className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterCat("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCat === "all" ? "bg-[#1B5E20] text-white" : "bg-muted hover:bg-muted/80"}`}>
            All
          </button>
          {STATIC_CATEGORIES.map(c => (
            <button key={c.slug} onClick={() => setFilterCat(c.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${filterCat === c.slug ? "bg-[#1B5E20] text-white" : "bg-muted hover:bg-muted/80"}`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-border overflow-hidden">
            <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
              {p.images?.[0] ? (
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {STATIC_CATEGORIES.find(c => c.slug === (p as any).category?.slug)?.icon ?? "🌿"}
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}>
                  {getStatusLabel(p.status)}
                </span>
                {(p as any).category?.name && (
                  <span className="bg-[#1B5E20]/90 text-white text-xs px-2 py-0.5 rounded-full">
                    {(p as any).category.icon} {(p as any).category.name}
                  </span>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{p.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{p.grade}</p>
              <p className="text-xs text-muted-foreground">{p.origin}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[#1B5E20] font-bold text-sm">{p.available_quantity} {p.unit}</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(p)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">No products found</div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && editProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto pt-8 pb-10 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-lg">{editProduct.id ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => { setShowForm(false); setEditProduct(null); }} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="col-span-2">
                  <Label>Product Category *</Label>
                  <Select value={(editProduct as any).category_id ?? ""} onValueChange={v => upd("category_id", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {STATIC_CATEGORIES.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.icon} {c.name} · {c.name_am}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Product Name *</Label>
                  <Input className="mt-1" value={editProduct.name ?? ""} onChange={e => upd("name", e.target.value)} placeholder="e.g. Fresh Washed Ginger" />
                </div>
                <div>
                  <Label>Sub-Category</Label>
                  <Input className="mt-1" value={(editProduct as any).sub_category ?? ""} onChange={e => upd("sub_category", e.target.value)} placeholder="e.g. Washed, Dried, Whole" />
                </div>
                <div>
                  <Label>Grade *</Label>
                  <Input className="mt-1" value={editProduct.grade ?? ""} onChange={e => upd("grade", e.target.value)} placeholder="e.g. Grade A Export" />
                </div>
                <div>
                  <Label>Origin</Label>
                  <Input className="mt-1" value={editProduct.origin ?? ""} onChange={e => upd("origin", e.target.value)} />
                </div>
                <div>
                  <Label>Growing Region</Label>
                  <Input className="mt-1" value={(editProduct as any).growing_region ?? ""} onChange={e => upd("growing_region", e.target.value)} placeholder="e.g. Hadiya Zone" />
                </div>
                <div>
                  <Label>Available Quantity</Label>
                  <Input type="number" className="mt-1" value={editProduct.available_quantity ?? 0} onChange={e => upd("available_quantity", parseFloat(e.target.value))} />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Select value={editProduct.unit ?? "MT"} onValueChange={v => upd("unit", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Minimum Order</Label>
                  <Input type="number" className="mt-1" value={editProduct.minimum_order ?? 1} onChange={e => upd("minimum_order", parseFloat(e.target.value))} />
                </div>
                <div>
                  <Label>Price per Unit (USD)</Label>
                  <Input type="number" className="mt-1" value={editProduct.price_per_unit ?? 0} onChange={e => upd("price_per_unit", parseFloat(e.target.value))} />
                </div>
                <div>
                  <Label>Harvest Date</Label>
                  <Input type="date" className="mt-1" value={editProduct.harvest_date ?? ""} onChange={e => upd("harvest_date", e.target.value)} />
                </div>
                <div>
                  <Label>Harvest Season</Label>
                  <Input className="mt-1" value={(editProduct as any).harvest_season ?? ""} onChange={e => upd("harvest_season", e.target.value)} placeholder="e.g. Oct–Jan" />
                </div>
                <div>
                  <Label>Moisture Level (%)</Label>
                  <Input type="number" className="mt-1" value={editProduct.moisture_level ?? 0} onChange={e => upd("moisture_level", parseFloat(e.target.value))} />
                </div>
                <div>
                  <Label>Packaging</Label>
                  <Input className="mt-1" value={editProduct.packaging ?? ""} onChange={e => upd("packaging", e.target.value)} placeholder="e.g. 25kg Mesh Bags" />
                </div>
                <div>
                  <Label>Delivery Time</Label>
                  <Input className="mt-1" value={editProduct.delivery_time ?? ""} onChange={e => upd("delivery_time", e.target.value)} />
                </div>
                <div>
                  <Label>Export Standard</Label>
                  <Input className="mt-1" value={editProduct.export_standard ?? ""} onChange={e => upd("export_standard", e.target.value)} />
                </div>
                <div>
                  <Label>Storage Conditions</Label>
                  <Input className="mt-1" value={(editProduct as any).storage_conditions ?? ""} onChange={e => upd("storage_conditions", e.target.value)} placeholder="e.g. Cool, dry place" />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editProduct.status ?? "available"} onValueChange={v => upd("status", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="limited">Limited</SelectItem>
                      <SelectItem value="sold_out">Sold Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <input type="checkbox" id="organic" checked={(editProduct as any).is_organic ?? false}
                    onChange={e => upd("is_organic", e.target.checked)} className="w-4 h-4 accent-[#1B5E20]" />
                  <Label htmlFor="organic">Organic Certified</Label>
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <Textarea className="mt-1" rows={3} value={editProduct.description ?? ""} onChange={e => upd("description", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>Image URLs (comma-separated)</Label>
                  <Input className="mt-1" placeholder="https://…" value={(editProduct.images ?? []).join(", ")}
                    onChange={e => upd("images", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => { setShowForm(false); setEditProduct(null); }}>Cancel</Button>
                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save Product"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
