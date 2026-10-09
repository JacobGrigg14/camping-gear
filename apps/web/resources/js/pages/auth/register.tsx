import { Link, useForm, usePage } from "@inertiajs/react";
import { AuthCard, Field, primaryButtonClass } from "@/components/auth/ui";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Seo } from "@/components/Seo";
import { safeNext } from "@/lib/api";

export default function RegisterPage({ socialProviders }: { socialProviders: string[] }) {
  const { url } = usePage();
  const next = safeNext(new URLSearchParams(url.split("?")[1] ?? "").get("next"));
  const form = useForm({ email: "", password: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.post("/register", { onFinish: () => form.reset("password") });
  }

  return (
    <AuthCard title="Create an account">
      <Seo title="Create an account" noindex />
      <p className="-mt-3 mb-6 text-bark-700">Free, and it keeps your favourites and trips in sync with the app.</p>
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
          autoComplete="new-password"
          minLength={8}
          required
          value={form.data.password}
          onChange={(e) => form.setData("password", e.target.value)}
          error={form.errors.password}
        />
        <button type="submit" disabled={form.processing} className={primaryButtonClass}>
          {form.processing ? "One moment…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-bark-700">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-forest-700 underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
