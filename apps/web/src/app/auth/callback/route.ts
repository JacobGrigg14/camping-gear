import { NextResponse } from "next/server";
import { safeNext, supabaseConfigured } from "@/lib/supabase/config";
import { getServerClient } from "@/lib/supabase/server";

/** Lands here after Google/Apple sign-in, email confirmation and password-reset links. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (code && supabaseConfigured) {
    const sb = await getServerClient();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  const message = url.searchParams.get("error_description") ?? "That sign-in link is invalid or has expired.";
  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, url.origin));
}
