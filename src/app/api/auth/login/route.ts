import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://tecyhxylnxnjijkwkrmw.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlY3loeHlsbnhuamlqa3drcm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjAyMTAsImV4cCI6MjEwMDI5NjIxMH0.xRnfsWdJdXXmkFNHmnWARS00ET1S_Kr2VFUJN1UiwdU";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Sign in using anon client — returns session tokens
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.session) {
      return NextResponse.json(
        { error: "Login failed — no session returned" },
        { status: 400 }
      );
    }

    // Fetch role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, company_name")
      .eq("id", data.user.id)
      .single();

    // Return session tokens to the client so it can call setSession()
    return NextResponse.json({
      success: true,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      role: profile?.role ?? "exporter",
      full_name: profile?.full_name ?? "",
      company_name: profile?.company_name ?? "",
    });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
