"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { Message } from "@/types";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "" });
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setMessages(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.message) { toast.error("Fill subject and message"); return; }
    setSending(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: prof } = await supabase.from("profiles").select("full_name, email, company_name, phone").eq("id", user.id).single();

    const { data, error } = await supabase.from("messages").insert({
      user_id: user.id,
      name: prof?.full_name ?? "User",
      email: prof?.email ?? user.email,
      phone: prof?.phone,
      company: prof?.company_name,
      subject: form.subject,
      message: form.message,
    }).select().single();

    setSending(false);
    if (error) { toast.error("Failed to send"); return; }
    toast.success("Message sent to support team");
    setMessages((prev) => [data, ...prev]);
    setForm({ subject: "", message: "" });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Message Dename Agricultural Supplier</p>
      </div>

      {/* New message form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Send a Message to Dename</h2>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input id="subject" placeholder="e.g. Order inquiry, Payment issue…" className="mt-1"
              value={form.subject} onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="msg">Message *</Label>
            <Textarea id="msg" rows={4} placeholder="Describe your question or issue in detail…" className="mt-1"
              value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))} required />
          </div>
          <Button type="submit" disabled={sending}>
            {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> Send Message</>}
          </Button>
        </form>
      </div>

      {/* Message history */}
      <div>
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Message History</h2>
        {messages.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-12 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No messages yet. Send one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(msg.created_at)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${msg.is_read ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700"}`}>
                    {msg.is_read ? "Read" : "Unread"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  {msg.message}
                </p>
                {msg.reply && (
                  <div className="mt-3 border-l-4 border-[#1B5E20] pl-4">
                    <p className="text-xs font-semibold text-[#1B5E20] mb-1">Support Reply:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{msg.reply}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
