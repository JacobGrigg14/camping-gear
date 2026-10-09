import * as Sentry from "@sentry/react";

/** Reports browser errors to Sentry when VITE_SENTRY_DSN is set (production). Off locally. */
export function initErrorReporting() {
  const dsn: string | undefined = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || typeof window === "undefined") return;
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Errors only: no user details, cookies or request bodies (see the privacy policy).
    dataCollection: { userInfo: false, cookies: false, httpBodies: [] },
  });
}
