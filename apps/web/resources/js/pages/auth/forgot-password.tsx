import { useForm } from "@inertiajs/react";
import { Alert, AuthCard, Field, primaryButtonClass } from "@/components/auth/ui";
import { Seo } from "@/components/Seo";

export default function ForgotPasswordPage({ status }: { status?: string }) {
  const form = useForm({ email: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post("/forgot-password");
  }

  return (
    <AuthCard title="Reset password">
      <Seo title="Reset password" noindex />
      {status ? (
        <Alert kind="info">
          If an account exists for {form.data.email || "that email"}, a reset link is on its way.
        </Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={form.data.email}
            onChange={(e) => form.setData("email", e.target.value)}
            error={form.errors.email}
          />
          <button type="submit" disabled={form.processing} className={primaryButtonClass}>
            Send reset link
          </button>
        </form>
      )}
    </AuthCard>
  );
}
