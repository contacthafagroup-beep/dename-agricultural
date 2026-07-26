"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const CATEGORIES = ["warehouse", "farm", "products", "packing", "transportation"];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", image_url: "", category: "products", order_index: 0 });
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("gallery").select("*").order("order_index");
    setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.title || !form.image_url) { toast.error("Title and image URL required"); return; }
    setSaving(true);
    const { error } = await supabase.from("gallery").insert(form);
    setSaving(false);
    if (error) { toast.error("Failed to add"); return; }
    toast.success("Added to gallery");
    setShowForm(false);
    setForm({ title: "", description: "", image_url: "", category: "products", order_index: 0 });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    toast.success("Removed");
    load();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-muted-foreground text-sm">{items.length} images</p>
        </div>
        <Button onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Add Image</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-border">
            <div className="h-40 overflow-hidden">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground capitalize">{item.category.replace("_", " ")}</p>
            </div>
            <button onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">No images in gallery</div>
        )}
      </div>

      {/* Add image modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold text-lg">Add Gallery Image</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label>Title *</Label>
                <Input className="mt-1" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Image title" />
              </div>
              <div>
                <Label>Image URL *</Label>
                <Input className="mt-1" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://…" />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea className="mt-1" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <Label>Order Index</Label>
                <Input type="number" className="mt-1" value={form.order_index} onChange={e => setForm(p => ({ ...p, order_index: parseInt(e.target.value) }))} />
              </div>
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="w-full h-32 object-cover rounded-xl" onError={e => (e.currentTarget.style.display = "none")} />
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleAdd} disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</> : "Add Image"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
