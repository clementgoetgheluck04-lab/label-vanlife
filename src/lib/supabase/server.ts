import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireServerEnv } from "@/server/env";

const FALLBACK_URL = "http://127.0.0.1:54321";
const FALLBACK_KEY = "supabase-not-configured";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NODE_ENV === "production"
    ? requireServerEnv("NEXT_PUBLIC_SUPABASE_URL")
    : process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const key = process.env.NODE_ENV === "production"
    ? requireServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // ignore in SSR
          }
        },
      },
    },
  );
}
