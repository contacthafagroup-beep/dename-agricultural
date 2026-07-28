import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "NOT SET";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "NOT SET";

  // Test actual connection to Supabase
  let supabaseReachable = false;
  let supabaseError = "";
  
  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { "apikey": key, "Content-Type": "application/json" },
    });
    supabaseReachable = res.ok;
    if (!res.ok) supabaseError = `HTTP ${res.status}`;
  } catch (e) {
    supabaseError = String(e);
  }

  return NextResponse.json({
    url_set: url !== "NOT SET",
    url_preview: url.substring(0, 45),
    key_set: key !== "NOT SET",
    key_preview: key.substring(0, 20) + "...",
    supabase_reachable: supabaseReachable,
    supabase_error: supabaseError || "none",
    node_env: process.env.NODE_ENV,
  });
}
