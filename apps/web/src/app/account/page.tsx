import type { Metadata } from "next";
import { Alert } from "@/components/auth/ui";
import { AccountActions } from "@/components/account/AccountActions";
import { requireUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const { user } = await requireUser("/account");
  const { updated } = await searchParams;
  const provider = user.app_metadata.provider ?? "email";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-extrabold">Your account</h1>
      {updated && (
        <div className="mt-6">
          <Alert kind="info">Your password has been updated.</Alert>
        </div>
      )}
      <dl className="mt-8 divide-y divide-canvas-200 rounded-lg border border-canvas-200 bg-white">
        <div className="flex justify-between gap-4 p-4">
          <dt className="font-semibold text-bark-700">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div className="flex justify-between gap-4 p-4">
          <dt className="font-semibold text-bark-700">Signed in with</dt>
          <dd className="capitalize">{provider}</dd>
        </div>
      </dl>
      <AccountActions />
    </div>
  );
}
