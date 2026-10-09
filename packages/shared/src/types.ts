export type Retailer = "amazon" | "mec" | "bass-pro" | "rei";

export type CategorySlug = "shelter-sleep" | "packs-clothing" | "lighting-tools-furniture";

export type PriceTier = "$" | "$$" | "$$$" | "$$$$";

export const priceTierLabels: Record<PriceTier, string> = {
  $: "Budget",
  $$: "Mid-range",
  $$$: "Premium",
  $$$$: "Top-end",
};

export type Subcategory = {
  slug: string;
  name: string;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
};

export type AffiliateLink = {
  retailer: Retailer;
  /** Affiliate URL. Leave empty until the real link is available. */
  url: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;
  shortDescription: string;
  description: string;
  images: string[];
  priceTier: PriceTier;
  /** Editorial rating, 1–5. */
  rating: number;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  links: AffiliateLink[];
  featured?: boolean;
  tags: string[];
};
