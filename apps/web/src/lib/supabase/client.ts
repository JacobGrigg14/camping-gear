import { createBrowserClient } from "@supabase/ssr";
import type { BasecampClient, Database } from "@basecamp/shared";
import { supabaseConfigured, supabaseKey, supabaseUrl } from "./config";

let client: BasecampClient | null = null;

/** Browser Supabase client (session lives in cookies shared with the server). Null if not configured. */
export function getBrowserClient(): BasecampClient | null {
  if (!supabaseConfigured) return null;
  client ??= createBrowserClient<Database>(supabaseUrl, supabaseKey);
  return client;
}
