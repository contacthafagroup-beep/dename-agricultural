import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  // Detect placeholder / unconfigured Supabase — skip auth entirely
  const isConfigured =
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-project") &&
    !supabaseUrl.includes("placeholder") &&
    supabaseKey.length > 20 &&
    !supabaseKey.includes("your_") &&
    !supabaseKey.includes("placeholder");

  if (!isConfigured) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    return supabaseResponse;
  }

  const { pathname } = request.nextUrl;
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute =
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register");

  // ── Not logged in trying to access protected pages ──
  if ((isDashboardRoute || isAdminRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // ── Logged in — check role for admin routes ──
  if (isAdminRoute && user) {
    let role = "exporter";
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      role = profile?.role ?? "exporter";
    } catch {
      // profile fetch failed — treat as non-admin
    }

    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // ── Already logged in trying to visit login/register ──
  if (isAuthRoute && user) {
    let role = "exporter";
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      role = profile?.role ?? "exporter";
    } catch {
      // ignore
    }

    const url = request.nextUrl.clone();
    url.pathname = role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
