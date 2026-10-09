import { router } from "@inertiajs/react";

export function AccountActions() {
  function onSignOut() {
    router.post("/logout");
  }

  function onDelete() {
    if (!confirm("Delete your account? Your saved lists and trips will be permanently removed.")) return;
    router.delete("/account");
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
    </div>
  );
}
