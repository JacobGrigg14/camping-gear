import Image from "next/image";
import Link from "next/link";
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
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-bark-500">{product.brand}</p>
          <h3 className="font-display text-lg font-bold leading-snug group-hover:text-forest-700">{product.name}</h3>
          <p className="text-sm text-bark-700">{product.shortDescription}</p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <Rating value={product.rating} />
            <PriceTier tier={product.priceTier} />
          </div>
        </div>
      </Link>
      <SaveButton productId={product.id} className="absolute right-3 top-3" />
    </div>
  );
}
