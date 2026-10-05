import type { Metadata } from "next";
import Link from "next/link";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { OAuthButtons, OrDivider } from "@/components/auth/OAuthButtons";
import { AuthCard, NotConfigured } from "@/components/auth/ui";
import { safeNext, supabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Create an account", robots: { index: false } };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const params = await searchParams;
  const next = safeNext(typeof params.next === "string" ? params.next : null);

  return (
    <AuthCard title="Create an account">
      <p className="-mt-3 mb-6 text-bark-700">Free, and it keeps your favourites and trips in sync with the app.</p>
      {!supabaseConfigured ? (
        <NotConfigured />
      ) : (
        <>
          <OAuthButtons next={next} />
          <OrDivider />
          <EmailAuthForm mode="sign-up" next={next} />
          <p className="mt-6 text-center text-sm text-bark-700">
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-forest-700 underline">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthCard>
  );
}
