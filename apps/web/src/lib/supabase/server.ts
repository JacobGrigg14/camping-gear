import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { BasecampClient, Database } from "@basecamp/shared";
import { supabaseConfigured, supabaseKey, supabaseUrl } from "./config";

export async function getServerClient(): Promise<BasecampClient> {
  const cookieStore = await cookies();
  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only. The proxy refreshes the session instead.
        }
      },
    },
  });
}

/** For signed-in-only pages: returns the client and user, or redirects to /login and back. */
export async function requireUser(next: string): Promise<{ sb: BasecampClient; user: User }> {
  await connection(); // always render per request, even before Supabase is configured
  if (!supabaseConfigured) redirect(`/login?next=${encodeURIComponent(next)}`);
  const sb = await getServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return { sb, user };
}
