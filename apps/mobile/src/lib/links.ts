import { getAffiliateUrl, type Product, type Retailer } from "@basecamp/shared";
import { apiUrl } from "./api";

/**
 * Where a buy button should send the user, or undefined while the affiliate link is pending.
 * Clicks route through the website's /go redirect so all click tracking lives in one place.
 */
export function buyUrl(product: Product, retailer: Retailer): string | undefined {
  const url = getAffiliateUrl(product, retailer);
  if (!url) return undefined;
  return apiUrl ? `${apiUrl}/go/${product.slug}/${retailer}?src=app` : url;
}
