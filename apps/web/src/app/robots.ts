import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/go/", "/search"] },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
