import type { MetadataRoute } from "next";
import { getCategories, getProducts, productPath } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  return [
    { url: url("/"), priority: 1 },
    ...getCategories().map((c) => ({ url: url(`/gear/${c.slug}`), priority: 0.8 })),
    ...getProducts().map((p) => ({ url: url(productPath(p)), priority: 0.6 })),
    { url: url("/about"), priority: 0.3 },
    { url: url("/disclosure"), priority: 0.3 },
  ];
}
