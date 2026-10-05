import Link from "next/link";
import { amazonDisclosure, disclosureShort, getCategories, site } from "@basecamp/shared";

export function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-bark-700 bg-bark-900 text-canvas-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-canvas-50">{site.name}</p>
          <p className="mt-2 text-sm">{site.tagline}</p>
        </div>
        <div>
          <p className="font-semibold text-canvas-50">Gear</p>
          <ul className="mt-2 space-y-1 text-sm">
            {getCategories().map((c) => (
              <li key={c.slug}>
                <Link href={`/gear/${c.slug}`} className="hover:text-ember-500">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-canvas-50">About</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/about" className="hover:text-ember-500">
                About us
              </Link>
            </li>
            <li>
              <Link href="/disclosure" className="hover:text-ember-500">
                Affiliate disclosure
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bark-700 px-4 py-4 text-center text-xs text-canvas-300">
        {disclosureShort} {amazonDisclosure} © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}
