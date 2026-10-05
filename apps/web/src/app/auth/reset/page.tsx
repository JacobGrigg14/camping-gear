"use client";

import { useState } from "react";
import { Alert, AuthCard, Field, NotConfigured, primaryButtonClass } from "@/components/auth/ui";
import { getBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const sb = getBrowserClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setError("");
    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/update-password`;
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <AuthCard title="Reset password">
      {!sb ? (
        <NotConfigured />
      ) : sent ? (
        <Alert kind="info">If an account exists for {email}, a reset link is on its way.</Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <Alert>{error}</Alert>}
          <button type="submit" className={primaryButtonClass}>
            Send reset link
          </button>
        </form>
      )}
    </AuthCard>
  );
}
