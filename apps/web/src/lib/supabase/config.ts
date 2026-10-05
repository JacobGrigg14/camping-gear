export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until the Supabase env vars are set; accounts are disabled but browsing still works. */
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/** Only allow same-site relative paths as post-login redirects. */
export function safeNext(next: string | null | undefined, fallback = "/my-gear"): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
