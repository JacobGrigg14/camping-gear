"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteList, type GearList, renameList } from "@basecamp/shared";
import { getBrowserClient } from "@/lib/supabase/client";
import { useAccount } from "../AccountProvider";

const linkButton = "text-sm font-semibold text-forest-700 hover:underline";

export function ListActions({ list }: { list: GearList }) {
  const router = useRouter();
  const { refreshLists } = useAccount();
  const [error, setError] = useState("");

  async function run(action: () => Promise<void>, then: () => void) {
    setError("");
    try {
      await action();
      await refreshLists();
      then();
    } catch {
      setError("Something went wrong. Try again.");
    }
  }

  function onRename() {
    const sb = getBrowserClient();
    const name = prompt("Rename list", list.name)?.trim();
    if (!sb || !name || name === list.name) return;
    run(
      () => renameList(sb, list.id, name),
      () => router.refresh(),
    );
  }

  function onDelete() {
    const sb = getBrowserClient();
    if (!sb || !confirm(`Delete “${list.name}”? The gear stays on the site; only this list is removed.`)) return;
    run(
      () => deleteList(sb, list.id),
      () => router.replace("/my-gear"),
    );
  }

  return (
    <div className="flex items-center gap-4">
      <button type="button" onClick={onRename} className={linkButton}>
        Rename
      </button>
      {!list.isFavorites && (
        <button type="button" onClick={onDelete} className="text-sm font-semibold text-red-700 hover:underline">
          Delete list
        </button>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

export function RemoveFromList({ listId, productId }: { listId: string; productId: string }) {
  const router = useRouter();
  const { setSaved } = useAccount();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await setSaved(listId, productId, false);
      router.refresh();
    } catch {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={onClick} disabled={busy} className={`${linkButton} self-start disabled:opacity-50`}>
      {busy ? "Removing…" : "Remove from list"}
    </button>
  );
}
