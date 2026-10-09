import { usePage } from "@inertiajs/react";
import { type Product, productPath, site } from "@basecamp/shared";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BuyButtons } from "@/components/BuyButtons";
import { ImageGallery } from "@/components/ImageGallery";
import { JsonLd } from "@/components/JsonLd";
import { PriceTier } from "@/components/PriceTier";
import { ProductGrid } from "@/components/ProductGrid";
import { Rating } from "@/components/Rating";
import { SaveButton } from "@/components/SaveButton";
import { SaveToList } from "@/components/SaveToList";
import { Seo } from "@/components/Seo";

function jsonLd(product: Product, siteUrl: string) {
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

export default function ProductPage({
  product,
  category,
  subcategoryName,
  related,
}: {
  product: Product;
  category: { slug: string; name: string };
  subcategoryName: string;
  related: Product[];
}) {
  const { siteUrl } = usePage().props;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title={`${product.name} Review`}
        description={product.shortDescription}
        canonical={productPath(product)}
        image={product.images[0]}
        type="product"
      />
      <JsonLd id="product-jsonld" data={jsonLd(product, siteUrl)} />
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
          <p className="text-sm font-semibold tracking-wider text-bark-500 uppercase">
            {product.brand} · {subcategoryName}
          </p>
          <div className="mt-1 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-extrabold md:text-4xl">{product.name}</h1>
            <SaveButton productId={product.id} className="mt-1 shrink-0 border border-canvas-200" />
          </div>
          <div className="mt-3 flex items-center gap-4">
            <Rating value={product.rating} />
            <PriceTier tier={product.priceTier} />
          </div>
          <p className="mt-4 text-lg text-bark-700">{product.shortDescription}</p>
          <div className="mt-6 rounded-lg border border-canvas-200 bg-white p-5">
            <BuyButtons product={product} />
          </div>
          <div className="mt-4">
            <SaveToList productId={product.id} />
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
