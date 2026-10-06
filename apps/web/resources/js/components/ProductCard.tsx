import { Link } from "@inertiajs/react";
import { type Product, productPath } from "@basecamp/shared";
import { PriceTier } from "./PriceTier";
import { Rating } from "./Rating";
import { SaveButton } from "./SaveButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="relative">
      <Link
        href={productPath(product)}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-canvas-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="relative aspect-[4/3] bg-canvas-100">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="text-xs font-semibold tracking-wider text-bark-500 uppercase">{product.brand}</p>
          <h3 className="font-display text-lg leading-snug font-bold group-hover:text-forest-700">{product.name}</h3>
          <p className="text-sm text-bark-700">{product.shortDescription}</p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <Rating value={product.rating} />
            <PriceTier tier={product.priceTier} />
          </div>
        </div>
      </Link>
      <SaveButton productId={product.id} className="absolute top-3 right-3" />
    </div>
  );
}
