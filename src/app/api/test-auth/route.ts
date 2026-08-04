import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://tecyhxylnxnjijkwkrmw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlY3loeHlsbnhuamlqa3drcm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjAyMTAsImV4cCI6MjEwMDI5NjIxMH0.xRnfsWdJdXXmkFNHmnWARS00ET1S_Kr2VFUJN1UiwdU";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      data,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
