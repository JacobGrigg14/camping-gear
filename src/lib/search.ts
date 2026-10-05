import type { Product } from "@/types";

export function searchProducts(list: Product[], query: string): Product[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return list.filter((p) => {
    const haystack = [p.name, p.brand, p.subcategory, p.shortDescription, p.description, ...p.tags]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}
