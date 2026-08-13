import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://tecyhxylnxnjijkwkrmw.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlY3loeHlsbnhuamlqa3drcm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjAyMTAsImV4cCI6MjEwMDI5NjIxMH0.xRnfsWdJdXXmkFNHmnWARS00ET1S_Kr2VFUJN1UiwdU";

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlY3loeHlsbnhuamlqa3drcm13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcyMDIxMCwiZXhwIjoyMTAwMjk2MjEwfQ.wIKQFK8bIX7j5pBZA9D5GBjvg2vXqwL_F5VrvwxQh3c";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, companyName, phone, country } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Admin client — bypasses RLS and trigger issues
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Step 1: Create auth user — email_confirm:true skips verification email
    const { data: createdUser, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName || "",
          company_name: companyName || "",
        },
      });

    if (createError) {
      const msg = createError.message?.toLowerCase() ?? "";
      if (
        msg.includes("already registered") ||
        msg.includes("already been registered") ||
        msg.includes("user already exists")
      ) {
        return NextResponse.json(
          { error: "This email is already registered. Please sign in." },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    const userId = createdUser?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User created but no ID returned" },
        { status: 500 }
      );
    }

    // Step 2: Insert profile with service-role (bypasses RLS completely)
    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert(
        {
          id: userId,
          email,
          full_name: fullName || "",
          company_name: companyName || "",
          phone: phone || "",
          country: country || "",
          role: "exporter",
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.error("Profile insert error (non-fatal):", profileError.message);
    }

    // Step 3: Auto sign-in — return session tokens so client can setSession()
    const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: signInData, error: signInError } =
      await anonClient.auth.signInWithPassword({ email, password });

    if (signInError || !signInData.session) {
      // User was created but auto-login failed — still success, just needs to log in manually
      return NextResponse.json({
        success: true,
        auto_login: false,
        message: "Account created! Please sign in.",
      });
    }

    return NextResponse.json({
      success: true,
      auto_login: true,
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
      role: "exporter",
    });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
