// Helpers over catalog data. The catalog itself lives in the Laravel database: the website
// gets it as page props, the app from GET /api/v1/catalog.
import type { Category, Product, Retailer } from "./types";

export function getAffiliateUrl(product: Product, retailer: Retailer): string | undefined {
  return product.links.find((l) => l.retailer === retailer)?.url || undefined;
}

export function getSubcategoryName(categories: Category[], product: Product): string {
  return (
    categories.find((c) => c.slug === product.category)?.subcategories.find((s) => s.slug === product.subcategory)
      ?.name ?? product.subcategory
  );
}

export function getRelatedProducts(products: Product[], product: Product, limit = 4): Product[] {
  const sameCategory = products.filter((p) => p.category === product.category && p.id !== product.id);
  return [
    ...sameCategory.filter((p) => p.subcategory === product.subcategory),
    ...sameCategory.filter((p) => p.subcategory !== product.subcategory),
  ].slice(0, limit);
}

export function getTopRated(products: Product[], limit: number): Product[] {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function productPath(product: Product): string {
  return `/gear/${product.category}/${product.slug}`;
}
