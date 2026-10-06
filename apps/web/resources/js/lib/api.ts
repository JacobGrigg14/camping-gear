import { createApiClient } from "@basecamp/shared";

/** The JSON API on this same site, signed in with the session cookie. */
export const api = createApiClient({ baseUrl: "" });

/** Only allow same-site relative paths as post-login redirects. */
export function safeNext(next: string | null | undefined, fallback = "/my-gear"): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
