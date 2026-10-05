import type { Metadata } from "next";
import Link from "next/link";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { OAuthButtons, OrDivider } from "@/components/auth/OAuthButtons";
import { Alert, AuthCard, NotConfigured } from "@/components/auth/ui";
import { safeNext, supabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = safeNext(typeof params.next === "string" ? params.next : null);
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <AuthCard title="Sign in">
      <p className="-mt-3 mb-6 text-bark-700">
        Save gear to your lists and plan trip checklists on the web and in the app.
      </p>
      {!supabaseConfigured ? (
        <NotConfigured />
      ) : (
        <>
          {error && (
            <div className="mb-4">
              <Alert>{error}</Alert>
            </div>
          )}
          <OAuthButtons next={next} />
          <OrDivider />
          <EmailAuthForm mode="sign-in" next={next} />
          <p className="mt-6 text-center text-sm text-bark-700">
            New here?{" "}
            <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-semibold text-forest-700 underline">
              Create an account
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}
