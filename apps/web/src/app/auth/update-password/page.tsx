"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AuthCard, Field, primaryButtonClass } from "@/components/auth/ui";
import { getBrowserClient } from "@/lib/supabase/client";

/** Reached from the password-reset email (the callback route has already signed the user in). */
export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getBrowserClient();
    if (!sb) return;
    const { error } = await sb.auth.updateUser({ password });
    if (error) return setError(error.message);
    router.replace("/account?updated=1");
  }

  return (
    <AuthCard title="Choose a new password">
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="New password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Alert>{error}</Alert>}
        <button type="submit" className={primaryButtonClass}>
          Save password
        </button>
      </form>
    </AuthCard>
  );
}
