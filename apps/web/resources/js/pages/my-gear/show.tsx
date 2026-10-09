import { Link } from "@inertiajs/react";
import type { GearList, Product } from "@basecamp/shared";
import { ListActions, RemoveFromList } from "@/components/account/ListActions";
import { ProductCard } from "@/components/ProductCard";
import { Seo } from "@/components/Seo";

export default function ListPage({ list, products }: { list: GearList; products: Product[] }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Seo title={list.name} noindex />
      <Link href="/my-gear" className="text-sm font-semibold text-forest-700 hover:underline">
        ← My Gear
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl font-extrabold">{list.name}</h1>
        <ListActions list={list} />
      </div>

      {products.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-bark-300 p-10 text-center">
          <p className="text-lg font-semibold">Nothing saved here yet</p>
          <p className="mt-1 text-bark-700">
            {list.isFavorites
              ? "Tap the heart on any product to save it."
              : "Use “Save to a list…” on a product page to add gear."}
          </p>
          <Link href="/" className="mt-4 inline-block font-semibold text-forest-700 underline">
            Browse gear
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id} className="flex flex-col gap-2">
              <ProductCard product={p} />
              <RemoveFromList listId={list.id} productId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
