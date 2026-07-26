"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { ProductCategory } from "@/types";

const emptyCategory: Partial<ProductCategory> = {
  name: "", name_am: "", slug: "", icon: "", description: "", description_am: "",
  cover_image: "", color: "#1B5E20", order_index: 0, is_active: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState<Partial<ProductCategory> | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("product_categories").select("*").order("order_index");
    setCategories(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditCat({ ...emptyCategory }); setShowForm(true); };
  const openEdit = (c: ProductCategory) => { setEditCat({ ...c }); setShowForm(true); };

  const handleSave = async () => {
    if (!editCat?.name || !editCat.slug) { toast.error("Name and slug are required"); return; }
    setSaving(true);
    if (editCat.id) {
      const { error } = await supabase.from("product_categories").update(editCat).eq("id", editCat.id);
      if (error) { toast.error("Update failed"); } else { toast.success("Category updated"); }
    } else {
      const { error } = await supabase.from("product_categories").insert(editCat);
      if (error) { toast.error("Create failed: " + error.message); } else { toast.success("Category created"); }
    }
    setSaving(false);
    setShowForm(false);
    setEditCat(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in this category will be unlinked.")) return;
    await supabase.from("product_categories").delete().eq("id", id);
    toast.success("Category deleted");
    load();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("product_categories").update({ is_active: !current }).eq("id", id);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c));
    toast.success(!current ? "Category activated" : "Category hidden");
  };

  const upd = (k: string, v: unknown) => setEditCat(p => p ? ({ ...p, [k]: v }) : p);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Categories</h1>
          <p className="text-muted-foreground text-sm">{categories.length} categories · Add unlimited new ones</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div key={cat.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-white dark:bg-gray-800 rounded-2xl border overflow-hidden transition-all ${cat.is_active ? "border-border" : "border-border opacity-60"}`}>
            {cat.cover_image && (
              <div className="h-28 overflow-hidden">
                <img src={cat.cover_image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{cat.name}</p>
                  <p className="text-xs text-[#D89C2B]">{cat.name_am}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">/{cat.slug}</p>
              {cat.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{cat.description}</p>}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(cat)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toggleActive(cat.id, cat.is_active)}
                  title={cat.is_active ? "Hide category" : "Show category"}>
                  {cat.is_active ? <Eye className="w-3.5 h-3.5 text-green-600" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 ml-auto"
                  onClick={() => handleDelete(cat.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && editCat && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto pt-8 pb-10 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-lg">{editCat.id ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => { setShowForm(false); setEditCat(null); }} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name (English) *</Label>
                  <Input className="mt-1" value={editCat.name ?? ""} onChange={e => upd("name", e.target.value)} placeholder="e.g. Sesame" />
                </div>
                <div>
                  <Label>Name (Amharic)</Label>
                  <Input className="mt-1" value={editCat.name_am ?? ""} onChange={e => upd("name_am", e.target.value)} placeholder="e.g. ሰሊጥ" />
                </div>
                <div>
                  <Label>URL Slug *</Label>
                  <Input className="mt-1" value={editCat.slug ?? ""} onChange={e => upd("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} placeholder="e.g. sesame" />
                </div>
                <div>
                  <Label>Icon (emoji)</Label>
                  <Input className="mt-1" value={editCat.icon ?? ""} onChange={e => upd("icon", e.target.value)} placeholder="e.g. 🌾" />
                </div>
                <div>
                  <Label>Accent Color (hex)</Label>
                  <Input className="mt-1" value={editCat.color ?? "#1B5E20"} onChange={e => upd("color", e.target.value)} placeholder="#1B5E20" />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input type="number" className="mt-1" value={editCat.order_index ?? 0} onChange={e => upd("order_index", parseInt(e.target.value))} />
                </div>
                <div className="col-span-2">
                  <Label>Description (English)</Label>
                  <Textarea className="mt-1" rows={2} value={editCat.description ?? ""} onChange={e => upd("description", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>Description (Amharic)</Label>
                  <Textarea className="mt-1" rows={2} value={editCat.description_am ?? ""} onChange={e => upd("description_am", e.target.value)} />
                </div>
                <div className="col-span-2">
                  <Label>Cover Image URL</Label>
                  <Input className="mt-1" value={editCat.cover_image ?? ""} onChange={e => upd("cover_image", e.target.value)} placeholder="https://…" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => { setShowForm(false); setEditCat(null); }}>Cancel</Button>
                <Button className="flex-1" onClick={handleSave} disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save Category"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
