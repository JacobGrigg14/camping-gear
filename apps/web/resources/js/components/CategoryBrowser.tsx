import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { type PriceTier, priceTierLabels, type Product, type Subcategory } from "@basecamp/shared";
import { Pagination } from "./Pagination";
import { ProductGrid } from "./ProductGrid";

type Sort = "rating" | "price-asc" | "price-desc" | "name";

const PAGE_SIZE = 9;

const noSubscribe = () => () => {};

const selectClass =
  "select w-full rounded-md border border-canvas-300 bg-white py-2 pl-3 text-sm focus:border-forest-500 focus:outline-none";

export function CategoryBrowser({ products, subcategories }: { products: Product[]; subcategories: Subcategory[] }) {
  const [chosenSubcategory, setSubcategory] = useState<string | null>(null);
  // Deep links like /gear/shelter-sleep?type=tents (from trip checklists) preselect a type until the visitor picks one.
  // Read on the client only, so the server-rendered page is the same for every visitor.
  const urlType = useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get("type"),
    () => null,
  );
  const subcategory = chosenSubcategory ?? (urlType && subcategories.some((s) => s.slug === urlType) ? urlType : "");
  const [brand, setBrand] = useState("");
  const [tier, setTier] = useState<PriceTier | "">("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<Sort>("rating");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);

  const visible = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        (!subcategory || p.subcategory === subcategory) &&
        (!brand || p.brand === brand) &&
        (!tier || p.priceTier === tier) &&
        p.rating >= minRating,
    );
    return filtered.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.priceTier.length - b.priceTier.length || b.rating - a.rating;
        case "price-desc":
          return b.priceTier.length - a.priceTier.length || b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return b.rating - a.rating;
      }
    });
  }, [products, subcategory, brand, tier, minRating, sort]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = visible.slice(start, start + PAGE_SIZE);

  // Any filter or sort change starts back at page 1.
  function update<T>(set: (value: T) => void) {
    return (value: T) => {
      set(value);
      setPage(1);
    };
  }

  const goToPage = (n: number) => {
    setPage(n);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reset = () => {
    setSubcategory("");
    setBrand("");
    setTier("");
    setMinRating(0);
    setPage(1);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <aside className="space-y-4" aria-label="Filters">
        <div>
          <p className="mb-2 text-sm font-semibold">Type</p>
          <div className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
            {[{ slug: "", name: "All" }, ...subcategories].map((s) => (
              <button
                key={s.slug}
                onClick={() => update(setSubcategory)(s.slug)}
                className={`rounded-full px-3 py-1 text-sm ${
                  subcategory === s.slug ? "bg-forest-700 text-white" : "bg-canvas-100 hover:bg-canvas-200"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <label className="block text-sm font-semibold">
          Brand
          <select value={brand} onChange={(e) => update(setBrand)(e.target.value)} className={`mt-1 ${selectClass}`}>
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Price
          <select
            value={tier}
            onChange={(e) => update(setTier)(e.target.value as PriceTier | "")}
            className={`mt-1 ${selectClass}`}
          >
            <option value="">Any price</option>
            {(Object.keys(priceTierLabels) as PriceTier[]).map((t) => (
              <option key={t} value={t}>
                {t} · {priceTierLabels[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Rating
          <select
            value={minRating}
            onChange={(e) => update(setMinRating)(Number(e.target.value))}
            className={`mt-1 ${selectClass}`}
          >
            <option value={0}>Any rating</option>
            <option value={4}>4.0 & up</option>
            <option value={4.5}>4.5 & up</option>
          </select>
        </label>
        <button onClick={reset} className="text-sm text-bark-500 underline hover:text-ember-600">
          Clear filters
        </button>
      </aside>

      <div ref={resultsRef} className="scroll-mt-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-bark-500" aria-live="polite">
            {visible.length > PAGE_SIZE
              ? `Showing ${start + 1}–${start + pageItems.length} of ${visible.length} products`
              : `${visible.length} ${visible.length === 1 ? "product" : "products"}`}
          </p>
          <label className="flex items-center gap-2 text-sm whitespace-nowrap">
            Sort by
            <select
              value={sort}
              onChange={(e) => update(setSort)(e.target.value as Sort)}
              className={`w-auto ${selectClass}`}
            >
              <option value="rating">Top rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
        {visible.length > 0 ? (
          <>
            <ProductGrid products={pageItems} />
            <Pagination page={currentPage} pageCount={pageCount} onChange={goToPage} />
          </>
        ) : (
          <p className="rounded-lg bg-canvas-100 p-8 text-center text-bark-700">No gear matches those filters.</p>
        )}
      </div>
    </div>
  );
}
