import { router } from "@inertiajs/react";

export function SearchBox({ defaultValue }: { defaultValue?: string }) {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("q");
    const q = typeof value === "string" ? value.trim() : "";
    router.visit(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form action="/search" role="search" onSubmit={onSubmit}>
      <label className="sr-only">
        Search gear
        <input
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Search gear…"
          className="w-full rounded-md border border-canvas-200/40 bg-forest-900/40 px-3 py-1.5 text-sm text-canvas-50 placeholder:text-canvas-200/70 focus:border-ember-500 focus:outline-none"
        />
      </label>
    </form>
  );
}
