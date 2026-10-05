import { NextResponse, type NextRequest } from "next/server";
import { getAffiliateUrl, getProduct, isRetailer, productPath } from "@basecamp/shared";

// Outbound affiliate redirect: /go/<product-slug>/<retailer>.
// Keeps affiliate URLs in one place and gives us a hook for click tracking later.
export async function GET(request: NextRequest, ctx: RouteContext<"/go/[slug]/[retailer]">) {
  const { slug, retailer } = await ctx.params;
  const product = getProduct(slug);
  if (!product) return NextResponse.redirect(new URL("/", request.url));

  const url = isRetailer(retailer) ? getAffiliateUrl(product, retailer) : undefined;
  const response = NextResponse.redirect(url ?? new URL(productPath(product), request.url), 302);
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
