import type { Metadata } from "next";
import { SearchResults } from "@/components/SearchResults";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const initialQuery = typeof q === "string" ? q : "";
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-extrabold">Search gear</h1>
      <SearchResults key={initialQuery} products={getProducts()} initialQuery={initialQuery} />
    </div>
  );
}
