import { Link, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { site } from "@basecamp/shared";
import { AccountNav } from "./AccountNav";
import { SearchBox } from "./SearchBox";

export function Header() {
  const page = usePage();
  const { categories } = page.props;
  const menu = useRef<HTMLDetailsElement>(null);

  // The layout persists between pages, so close the mobile menu after navigating.
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [page.url]);

  return (
    <header className="border-b-4 border-bark-700 bg-forest-800 text-canvas-50">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
            <polygon points="16,3 30,28 2,28" fill="#c8642a" />
            <polygon points="16,12 23,28 9,28" fill="#2f4430" />
          </svg>
          <span className="font-display text-xl font-extrabold tracking-tight">{site.name}</span>
        </Link>
        <div className="ml-auto hidden w-64 md:block">
          <SearchBox />
        </div>
        <div className="hidden shrink-0 md:block">
          <AccountNav />
        </div>
        <details ref={menu} className="relative ml-auto md:hidden">
          <summary className="cursor-pointer list-none rounded border border-canvas-200/40 px-3 py-1 text-sm">
            Menu
          </summary>
          <div className="absolute right-0 z-20 mt-2 w-64 space-y-3 rounded-md bg-forest-900 p-4 shadow-lg">
            <SearchBox />
            {categories.map((c) => (
              <Link key={c.slug} href={`/gear/${c.slug}`} className="block py-1 hover:text-ember-500">
                {c.name}
              </Link>
            ))}
            <div className="border-t border-canvas-200/20 pt-3">
              <AccountNav stacked />
            </div>
          </div>
        </details>
      </div>
      <nav className="hidden bg-forest-900/60 md:block" aria-label="Categories">
        <ul className="mx-auto flex max-w-6xl gap-6 px-4 py-2 text-sm font-medium">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/gear/${c.slug}`} className="hover:text-ember-500">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
