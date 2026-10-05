import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BuyButtons } from "@/components/BuyButtons";
import { ImageGallery } from "@/components/ImageGallery";
import { PriceTier } from "@/components/PriceTier";
import { ProductGrid } from "@/components/ProductGrid";
import { Rating } from "@/components/Rating";
import {
  getCategory,
  getProduct,
  getProducts,
  getRelatedProducts,
  getSubcategoryName,
  type Product,
  productPath,
  site,
} from "@basecamp/shared";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((p) => ({ category: p.category, slug: p.slug }));
}

async function load(params: PageProps<"/gear/[category]/[slug]">["params"]) {
  const { category, slug } = await params;
  const product = getProduct(slug);
  return product && product.category === category ? product : undefined;
}

export async function generateMetadata({ params }: PageProps<"/gear/[category]/[slug]">): Promise<Metadata> {
  const product = await load(params);
  if (!product) return {};
  return {
    title: `${product.name} Review`,
    description: product.shortDescription,
    alternates: { canonical: productPath(product) },
    openGraph: { images: product.images.slice(0, 1) },
  };
}

function jsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((src) => new URL(src, siteUrl).toString()),
    brand: { "@type": "Brand", name: product.brand },
    review: {
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: product.rating, bestRating: 5 },
      author: { "@type": "Organization", name: site.name },
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/gear/[category]/[slug]">) {
  const product = await load(params);
  if (!product) notFound();
  const category = getCategory(product.category)!;
  const related = getRelatedProducts(product, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(product)).replace(/</g, "\\u003c") }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category.name, href: `/gear/${category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images} alt={product.name} />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-bark-500">
            {product.brand} · {getSubcategoryName(product)}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-4">
            <Rating value={product.rating} />
            <PriceTier tier={product.priceTier} />
          </div>
          <p className="mt-4 text-lg text-bark-700">{product.shortDescription}</p>
          <div className="mt-6 rounded-lg border border-canvas-200 bg-white p-5">
            <BuyButtons product={product} />
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold">Overview</h2>
            <p className="mt-3 leading-relaxed text-bark-700">{product.description}</p>
          </section>
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border-l-4 border-forest-500 bg-forest-50 p-5">
              <h3 className="text-lg font-bold text-forest-800">Pros</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {product.pros.map((p) => (
                  <li key={p}>+ {p}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border-l-4 border-bark-500 bg-canvas-100 p-5">
              <h3 className="text-lg font-bold text-bark-700">Cons</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {product.cons.map((c) => (
                  <li key={c}>− {c}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
        <section>
          <h2 className="text-2xl font-bold">Specs</h2>
          <dl className="mt-3 divide-y divide-canvas-200 rounded-lg border border-canvas-200 bg-white text-sm">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-2">
                <dt className="text-bark-500">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">You might also like</h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
