"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Save, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Profile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  const update = (k: keyof Profile, v: string) => setProfile((p) => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      company_name: profile.company_name,
      phone: profile.phone,
      whatsapp: profile.whatsapp,
      country: profile.country,
      address: profile.address,
    }).eq("id", user.id);

    setSaving(false);
    if (error) { toast.error("Failed to save profile"); return; }
    setSaved(true);
    toast.success("Profile updated!");
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  const fields = [
    { key: "full_name" as const, label: "Full Name", type: "text", placeholder: "John Doe" },
    { key: "company_name" as const, label: "Company Name", type: "text", placeholder: "Your company" },
    { key: "phone" as const, label: "Phone Number", type: "tel", placeholder: "+1 234 567 890" },
    { key: "whatsapp" as const, label: "WhatsApp Number", type: "tel", placeholder: "+1 234 567 890" },
    { key: "country" as const, label: "Country", type: "text", placeholder: "e.g. UAE, China, Germany" },
    { key: "address" as const, label: "Company Address", type: "text", placeholder: "Full address" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your buyer account</p>
      </div>

      {/* Avatar section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-[#1B5E20] flex items-center justify-center text-white text-3xl font-bold">
          {profile.full_name?.charAt(0) ?? profile.email?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="font-bold text-lg text-gray-900 dark:text-white">{profile.full_name ?? "—"}</p>
          <p className="text-muted-foreground text-sm">{profile.email}</p>
          <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#1B5E20]/10 text-[#1B5E20] text-xs font-semibold rounded-full capitalize">
            {profile.role ?? "exporter"}
          </span>
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-5">Edit Information</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={f.key === "address" ? "sm:col-span-2" : ""}>
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input id={f.key} type={f.type} placeholder={f.placeholder} className="mt-1"
                  value={(profile[f.key] as string) ?? ""}
                  onChange={(e) => update(f.key, e.target.value)} />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
              ) : saved ? (
                <><CheckCircle className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Email info */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-border p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">Account Security</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Email Address</p>
            <p className="text-muted-foreground text-sm">{profile.email}</p>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">Cannot be changed</span>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Password</p>
            <p className="text-muted-foreground text-sm">Change your account password</p>
          </div>
          <Button variant="outline" size="sm"
            onClick={() => window.location.href = "/auth/forgot-password"}>
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
}
