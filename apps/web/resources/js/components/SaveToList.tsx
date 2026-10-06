import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useAccount } from "./AccountProvider";

/** "Save to a list" panel on the product page: tick any list or create a new one. */
export function SaveToList({ productId }: { productId: string }) {
  const { user, lists, setSaved, newList } = useAccount();
  const { url } = usePage();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <p className="text-sm text-bark-700">
        <Link href={`/login?next=${encodeURIComponent(url)}`} className="font-semibold text-forest-700 underline">
          Sign in
        </Link>{" "}
        to save gear to your lists and trips.
      </p>
    );
  }

  async function run(action: () => Promise<unknown>) {
    setError("");
    try {
      await action();
    } catch {
      setError("Couldn't save that. Try again.");
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    await run(() => newList(trimmed, productId));
    setName("");
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="text-sm font-semibold text-forest-700 underline-offset-2 hover:underline"
      >
        {open ? "Done" : "Save to a list…"}
      </button>
      {open && (
        <div className="mt-3 space-y-2 rounded-md border border-canvas-200 bg-canvas-50 p-4">
          {lists.map((l) => (
            <label key={l.id} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-forest-700"
                checked={l.productIds.includes(productId)}
                onChange={(e) => run(() => setSaved(l.id, productId, e.target.checked))}
              />
              <span>{l.name}</span>
              <span className="text-bark-500">({l.productIds.length})</span>
            </label>
          ))}
          <form onSubmit={create} className="flex gap-2 pt-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New list, e.g. Winter kit"
              maxLength={80}
              className="flex-1 rounded-md border border-canvas-300 bg-white px-3 py-1.5 text-sm focus:border-forest-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="rounded-md bg-forest-700 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Create
            </button>
          </form>
          {error && <p className="text-sm text-red-700">{error}</p>}
        </div>
      )}
    </div>
  );
}
