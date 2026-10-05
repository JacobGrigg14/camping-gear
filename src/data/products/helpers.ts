import type { AffiliateLink, Retailer } from "@/types";

/** Placeholder gallery for a subcategory (see scripts/generate-placeholders.mjs). */
export function placeholderImages(subcategory: string): string[] {
  return [1, 2, 3].map((n) => (n === 1 ? `/placeholders/${subcategory}.svg` : `/placeholders/${subcategory}-${n}.svg`));
}

/** Retailer slots with empty URLs, to be filled in once affiliate links are approved. */
export function pendingLinks(...list: Retailer[]): AffiliateLink[] {
  return list.map((retailer) => ({ retailer, url: "" }));
}
