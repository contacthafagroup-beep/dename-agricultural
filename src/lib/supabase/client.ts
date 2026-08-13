import { createBrowserClient } from "@supabase/ssr";

// Singleton — one browser client shared across all components
// This ensures onAuthStateChange fires everywhere when setSession() is called
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://tecyhxylnxnjijkwkrmw.supabase.co";

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlY3loeHlsbnhuamlqa3drcm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MjAyMTAsImV4cCI6MjEwMDI5NjIxMH0.xRnfsWdJdXXmkFNHmnWARS00ET1S_Kr2VFUJN1UiwdU";

  client = createBrowserClient(supabaseUrl, supabaseKey);
  return client;
}
