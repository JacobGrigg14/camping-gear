// The only module pages should use to read catalog data. Swap the
// implementation here when products move to a CMS or database.
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { Category, Product, Retailer } from "@/types";

export function getCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getTopRated(limit: number): Product[] {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter((p) => p.category === product.category && p.id !== product.id);
  return [
    ...sameCategory.filter((p) => p.subcategory === product.subcategory),
    ...sameCategory.filter((p) => p.subcategory !== product.subcategory),
  ].slice(0, limit);
}

export function getAffiliateUrl(product: Product, retailer: Retailer): string | undefined {
  return product.links.find((l) => l.retailer === retailer)?.url || undefined;
}

export function getSubcategoryName(product: Product): string {
  return (
    getCategory(product.category)?.subcategories.find((s) => s.slug === product.subcategory)?.name ??
    product.subcategory
  );
}

export function productPath(product: Product): string {
  return `/gear/${product.category}/${product.slug}`;
}
