"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [sending, setSending] = useState<string | null>(null);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const sendReply = async (msg: any) => {
    const reply = replies[msg.id];
    if (!reply?.trim()) { toast.error("Write a reply first"); return; }
    setSending(msg.id);

    await supabase.from("messages").update({ reply, is_read: true }).eq("id", msg.id);

    // Send email reply via API
    try {
      await fetch("/api/contact/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: msg.email, name: msg.name, subject: msg.subject, reply }),
      });
    } catch { /* email is best-effort */ }

    toast.success("Reply sent!");
    setSending(null);
    setReplies(prev => ({ ...prev, [msg.id]: "" }));
    load();
  };

  const unread = messages.filter(m => !m.is_read).length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-muted-foreground text-sm">
          {messages.length} total · <span className="text-amber-600 font-semibold">{unread} unread</span>
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-border p-16 text-center">
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl border overflow-hidden transition-all ${!msg.is_read ? "border-[#1B5E20]/40" : "border-border"}`}>
              <button
                className="w-full text-left p-5 flex items-center justify-between gap-4"
                onClick={() => {
                  setExpanded(expanded === msg.id ? null : msg.id);
                  if (!msg.is_read) markRead(msg.id);
                }}>
                <div className="flex items-center gap-3 min-w-0">
                  {!msg.is_read && <div className="w-2 h-2 bg-[#1B5E20] rounded-full shrink-0" />}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white truncate">{msg.subject}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {msg.name} {msg.company ? `· ${msg.company}` : ""} · {formatDate(msg.created_at)}
                    </p>
                  </div>
                </div>
                {expanded === msg.id ? <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />}
              </button>

              {expanded === msg.id && (
                <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>From: <strong className="text-foreground">{msg.name}</strong></span>
                    <span>Email: <a href={`mailto:${msg.email}`} className="text-[#1B5E20]">{msg.email}</a></span>
                    {msg.phone && <span>Phone: {msg.phone}</span>}
                    {msg.company && <span>Company: {msg.company}</span>}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>

                  {msg.reply ? (
                    <div className="border-l-4 border-[#1B5E20] pl-4">
                      <p className="text-xs font-semibold text-[#1B5E20] mb-1">Your Reply:</p>
                      <p className="text-sm text-muted-foreground">{msg.reply}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Textarea placeholder="Type your reply…" rows={3}
                        value={replies[msg.id] ?? ""} onChange={e => setReplies(prev => ({ ...prev, [msg.id]: e.target.value }))} />
                      <Button size="sm" onClick={() => sendReply(msg)} disabled={sending === msg.id}>
                        {sending === msg.id ? "Sending…" : <><Send className="w-3.5 h-3.5" /> Send Reply</>}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
