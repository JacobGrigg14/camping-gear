"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { Alert, Field, primaryButtonClass } from "./ui";

/** Email + password sign-in or sign-up. */
export function EmailAuthForm({ mode, next }: { mode: "sign-in" | "sign-up"; next: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserClient();
    if (!sb) return;
    setBusy(true);
    setError("");
    if (mode === "sign-in") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } else {
      const emailRedirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo } });
      setBusy(false);
      if (error) return setError(error.message);
      // With email confirmation off, Supabase signs the user straight in.
      if (data.session) {
        router.replace(next);
        router.refresh();
      } else {
        setCheckEmail(true);
      }
    }
  }

  if (checkEmail) {
    return (
      <Alert kind="info">
        Check <strong>{email}</strong> for a link to confirm your account. It brings you right back here.
      </Alert>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Field
        label="Password"
        type="password"
        autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
        minLength={mode === "sign-up" ? 8 : undefined}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {mode === "sign-in" && (
        <p className="-mt-2 text-right text-sm">
          <Link href="/auth/reset" className="text-forest-700 hover:underline">
            Forgot password?
          </Link>
        </p>
      )}
      {error && <Alert>{error}</Alert>}
      <button type="submit" disabled={busy} className={primaryButtonClass}>
        {busy ? "One moment…" : mode === "sign-in" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
