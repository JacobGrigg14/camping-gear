import { useForm } from "@inertiajs/react";
import { AccountActions } from "@/components/account/AccountActions";
import { Alert, Field } from "@/components/auth/ui";
import { Seo } from "@/components/Seo";

export default function AccountPage({
  email,
  signInMethod,
  hasPassword,
  status,
}: {
  email: string;
  signInMethod: string;
  hasPassword: boolean;
  status?: string;
}) {
  const form = useForm({ current_password: "", password: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    form.put("/account/password", { preserveScroll: true, onSuccess: () => form.reset() });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Seo title="Your account" noindex />
      <h1 className="text-4xl font-extrabold">Your account</h1>
      {status && (
        <div className="mt-6">
          <Alert kind="info">{status}</Alert>
        </div>
      )}
      <dl className="mt-8 divide-y divide-canvas-200 rounded-lg border border-canvas-200 bg-white">
        <div className="flex justify-between gap-4 p-4">
          <dt className="font-semibold text-bark-700">Email</dt>
          <dd>{email}</dd>
        </div>
        <div className="flex justify-between gap-4 p-4">
          <dt className="font-semibold text-bark-700">Signed in with</dt>
          <dd className="capitalize">{signInMethod}</dd>
        </div>
      </dl>

      <section className="mt-10 max-w-md">
        <h2 className="text-xl font-bold">{hasPassword ? "Change password" : "Set a password"}</h2>
        {!hasPassword && (
          <p className="mt-1 text-sm text-bark-700">Lets you also sign in with your email and a password.</p>
        )}
        <form onSubmit={submit} className="mt-4 space-y-4">
          {hasPassword && (
            <Field
              label="Current password"
              type="password"
              autoComplete="current-password"
              required
              value={form.data.current_password}
              onChange={(e) => form.setData("current_password", e.target.value)}
              error={form.errors.current_password}
            />
          )}
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
          <button
            type="submit"
            disabled={form.processing}
            className="rounded-md bg-forest-700 px-4 py-2 font-semibold text-white hover:bg-forest-800 disabled:opacity-60"
          >
            Save password
          </button>
        </form>
      </section>

      <AccountActions />
    </div>
  );
}
