"use client";

import type { Provider } from "@supabase/supabase-js";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Alert } from "./ui";

const providers: { id: Provider; label: string; className: string; icon: React.ReactNode }[] = [
  {
    id: "apple",
    label: "Continue with Apple",
    className: "bg-black text-white hover:bg-neutral-800",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.39-.92-2.41-3.65zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.1 1.76-.96 2.8 1.01.08 2.05-.52 2.68-1.28z" />
      </svg>
    ),
  },
  {
    id: "google",
    label: "Continue with Google",
    className: "border border-canvas-300 bg-white text-bark-900 hover:bg-canvas-50",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.9a5.05 5.05 0 0 1-2.2 3.31v2.77h3.56c2.08-1.92 3.24-4.74 3.24-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
        />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z"
        />
      </svg>
    ),
  },
];

export function OAuthButtons({ next }: { next: string }) {
  const [error, setError] = useState("");

  async function signIn(provider: Provider) {
    const sb = getBrowserClient();
    if (!sb) return;
    setError("");
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await sb.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) setError(error.message);
  }

  return (
    <div className="space-y-2">
      {providers.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => signIn(p.id)}
          className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 font-semibold transition ${p.className}`}
        >
          {p.icon}
          {p.label}
        </button>
      ))}
      {error && <Alert>{error}</Alert>}
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-bark-500">
      <span className="h-px flex-1 bg-canvas-200" />
      or
      <span className="h-px flex-1 bg-canvas-200" />
    </div>
  );
}
