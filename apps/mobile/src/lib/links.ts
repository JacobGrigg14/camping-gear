import { getAffiliateUrl, type Product, type Retailer } from "@basecamp/shared";

const siteUrl = process.env.EXPO_PUBLIC_SITE_URL;

/**
 * Where a buy button should send the user, or undefined while the affiliate link is pending.
 * Once the website is deployed (EXPO_PUBLIC_SITE_URL set), clicks route through its /go
 * redirect so all click tracking lives in one place.
 */
export function buyUrl(product: Product, retailer: Retailer): string | undefined {
  const url = getAffiliateUrl(product, retailer);
  if (!url) return undefined;
  return siteUrl ? `${siteUrl.replace(/\/$/, "")}/go/${product.slug}/${retailer}` : url;
}
