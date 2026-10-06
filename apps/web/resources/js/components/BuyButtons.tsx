import { type Product, retailers } from "@basecamp/shared";
import { DisclosureNote } from "./DisclosureNote";

export function BuyButtons({ product }: { product: Product }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2">
        {product.links.map(({ retailer, url }) => {
          const name = retailers[retailer]?.name ?? retailer;
          return url ? (
            <a
              key={retailer}
              href={`/go/${product.slug}/${retailer}`}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="rounded-md bg-ember-500 px-4 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-ember-600"
            >
              Check price at {name}
            </a>
          ) : (
            <span
              key={retailer}
              aria-disabled="true"
              className="cursor-not-allowed rounded-md border border-dashed border-bark-300 px-4 py-3 text-center font-semibold text-bark-500"
            >
              {name}: coming soon
            </span>
          );
        })}
      </div>
      <DisclosureNote />
    </div>
  );
}
