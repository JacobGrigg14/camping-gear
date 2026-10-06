import type { Product } from "@basecamp/shared";
import { SearchResults } from "@/components/SearchResults";
import { Seo } from "@/components/Seo";

export default function SearchPage({ products, query }: { products: Product[]; query: string }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Seo title="Search" noindex />
      <h1 className="mb-6 text-4xl font-extrabold">Search gear</h1>
      <SearchResults products={products} initialQuery={query} />
    </div>
  );
}
