import { Link, useForm, usePage } from "@inertiajs/react";
import { Alert, AuthCard, Field, primaryButtonClass } from "@/components/auth/ui";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Seo } from "@/components/Seo";
import { safeNext } from "@/lib/api";

export default function LoginPage({
  status,
  error,
  socialProviders,
}: {
  status?: string;
  error?: string;
  socialProviders: string[];
}) {
  const { url } = usePage();
  const next = safeNext(new URLSearchParams(url.split("?")[1] ?? "").get("next"));
  const form = useForm({ email: "", password: "", remember: true });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post("/login", { onFinish: () => form.reset("password") });
  }

  return (
    <AuthCard title="Sign in">
      <Seo title="Sign in" noindex />
      <p className="-mt-3 mb-6 text-bark-700">
        Save gear to your lists and plan trip checklists on the web and in the app.
      </p>
      {(error || status) && (
        <div className="mb-4">{error ? <Alert>{error}</Alert> : <Alert kind="info">{status}</Alert>}</div>
      )}
      <OAuthButtons enabled={socialProviders} next={next} />
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
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={form.data.password}
          onChange={(e) => form.setData("password", e.target.value)}
          error={form.errors.password}
        />
        <p className="-mt-2 text-right text-sm">
          <Link href="/forgot-password" className="text-forest-700 hover:underline">
            Forgot password?
          </Link>
        </p>
        <button type="submit" disabled={form.processing} className={primaryButtonClass}>
          {form.processing ? "One moment…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-bark-700">
        New here?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-semibold text-forest-700 underline">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
