import { router } from "@inertiajs/react";
import { useState } from "react";
import type { GearList } from "@basecamp/shared";
import { api } from "@/lib/api";
import { useAccount } from "../AccountProvider";

const linkButton = "text-sm font-semibold text-forest-700 hover:underline";

export function ListActions({ list }: { list: GearList }) {
  const [error, setError] = useState("");

  async function run(action: () => Promise<unknown>, then: () => void) {
    setError("");
    try {
      await action();
      then();
    } catch {
      setError("Something went wrong. Try again.");
    }
  }

  function onRename() {
    const name = prompt("Rename list", list.name)?.trim();
    if (!name || name === list.name) return;
    void run(
      () => api.renameList(list.id, name),
      () => router.reload(),
    );
  }

  function onDelete() {
    if (!confirm(`Delete “${list.name}”? The gear stays on the site; only this list is removed.`)) return;
    void run(
      () => api.deleteList(list.id),
      () => router.visit("/my-gear", { replace: true }),
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
  const { setSaved } = useAccount();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    try {
      await setSaved(listId, productId, false);
      router.reload({ only: ["list", "products"] });
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
