import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://tecyhxylnxnjijkwkrmw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlY3loeHlsbnhuamlqa3drcm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjAyMTAsImV4cCI6MjEwMDI5NjIxMH0.xRnfsWdJdXXmkFNHmnWARS00ET1S_Kr2VFUJN1UiwdU";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, companyName, phone, country } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Call Supabase REST API directly — bypasses any client issues
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          full_name: fullName ?? "",
          company_name: companyName ?? "",
          phone: phone ?? "",
          country: country ?? "Ethiopia",
          role: "exporter",
        },
      }),
    });

    const data = await res.json();

    // Log full response for debugging
    console.log("Supabase signup response:", res.status, JSON.stringify(data));

    if (!res.ok) {
      const errorMsg = data?.msg || data?.message || data?.error_description || data?.error || JSON.stringify(data);
      return NextResponse.json({
        error: errorMsg,
        supabase_status: res.status,
        supabase_response: data,
      }, { status: 400 });
    }

    // Success — user created
    return NextResponse.json({
      success: true,
      message: "Account created! Check your email or sign in directly.",
      user_id: data.id,
    });

  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
