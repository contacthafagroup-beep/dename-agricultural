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

    // Use service-role admin client — bypasses RLS and trigger issues
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Step 1: Create auth user using admin API
    // email_confirm: true skips the email confirmation requirement
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

    console.log(
      "Admin createUser result:",
      createError ? createError.message : "OK",
      createdUser?.user?.id ?? "no-id"
    );

    if (createError) {
      // Handle "already registered" gracefully
      if (
        createError.message?.toLowerCase().includes("already registered") ||
        createError.message?.toLowerCase().includes("already been registered") ||
        createError.message?.toLowerCase().includes("user already exists")
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

    // Step 2: Insert profile using service-role (bypasses RLS completely)
    const { error: profileError } = await adminClient
      .from("profiles")
      .upsert(
        {
          id: userId,
          email: email,
          full_name: fullName || "",
          company_name: companyName || "",
          phone: phone || "",
          country: country || "",
          role: "exporter",
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.error("Profile insert error:", profileError.message);
      // Non-fatal — user exists in auth, profile can be created on first login
    }

    return NextResponse.json({
      success: true,
      message:
        "Account created successfully! You can now sign in.",
    });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
