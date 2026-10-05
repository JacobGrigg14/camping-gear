"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAccount } from "../AccountProvider";

export function AccountActions() {
  const router = useRouter();
  const { signOut } = useAccount();
  const [error, setError] = useState("");

  async function onSignOut() {
    await signOut();
    router.replace("/");
    router.refresh();
  }

  async function onDelete() {
    if (!confirm("Delete your account? Your saved lists and trips will be permanently removed.")) return;
    const sb = getBrowserClient();
    if (!sb) return;
    const { error } = await sb.rpc("delete_account");
    if (error) return setError(error.message);
    await onSignOut();
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onSignOut}
        className="rounded-md bg-forest-700 px-4 py-2 font-semibold text-white hover:bg-forest-800"
      >
        Sign out
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-md border border-red-300 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
      >
        Delete account
      </button>
      {error && <p className="w-full text-sm text-red-700">{error}</p>}
    </div>
  );
}
