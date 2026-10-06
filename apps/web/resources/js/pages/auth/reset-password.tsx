import { useForm } from "@inertiajs/react";
import { AuthCard, Field, primaryButtonClass } from "@/components/auth/ui";
import { Seo } from "@/components/Seo";

/** Reached from the password-reset email (sent from the website or the app). */
export default function ResetPasswordPage({ email, token }: { email: string; token: string }) {
  const form = useForm({ token, email, password: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post("/reset-password", { onFinish: () => form.reset("password") });
  }

  return (
    <AuthCard title="Choose a new password">
      <Seo title="Choose a new password" noindex />
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" value={form.data.email} readOnly error={form.errors.email} />
        <Field
          label="New password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={form.data.password}
          onChange={(e) => form.setData("password", e.target.value)}
          error={form.errors.password}
        />
        <button type="submit" disabled={form.processing} className={primaryButtonClass}>
          Save password
        </button>
      </form>
    </AuthCard>
  );
}
