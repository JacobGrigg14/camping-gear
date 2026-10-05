"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { type Product, searchProducts } from "@basecamp/shared";
import { ProductGrid } from "./ProductGrid";

export function SearchResults({ products, initialQuery }: { products: Product[]; initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => searchProducts(products, query), [products, query]);

  return (
    <div className="space-y-6">
      <input
        type="search"
        value={query}
        autoFocus
        aria-label="Search gear"
        placeholder="Try “tent”, “sleeping bag”, or “headlamp”"
        onChange={(e) => {
          setQuery(e.target.value);
          const q = e.target.value.trim();
          router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search", { scroll: false });
        }}
        className="w-full rounded-md border border-canvas-300 bg-white px-4 py-3 text-lg focus:border-forest-500 focus:outline-none"
      />
      {query.trim() === "" ? (
        <p className="text-bark-700">Start typing to search {products.length} products.</p>
      ) : results.length === 0 ? (
        <p className="text-bark-700">No gear found for “{query}”.</p>
      ) : (
        <>
          <p className="text-sm text-bark-500" aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <ProductGrid products={results} />
        </>
      )}
    </div>
  );
}
