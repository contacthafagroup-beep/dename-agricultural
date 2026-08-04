import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, companyName, phone, country } =
      await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName ?? "",
          company_name: companyName ?? "",
          phone: phone ?? "",
          country: country ?? "",
          role: "exporter",
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data.user?.id });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
