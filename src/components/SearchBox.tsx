export function SearchBox({ defaultValue }: { defaultValue?: string }) {
  return (
    <form action="/search" role="search">
      <label htmlFor="site-search" className="sr-only">
        Search gear
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search gear…"
        className="w-full rounded-md border border-canvas-200/40 bg-forest-900/40 px-3 py-1.5 text-sm text-canvas-50 placeholder:text-canvas-200/70 focus:border-ember-500 focus:outline-none"
      />
    </form>
  );
}
