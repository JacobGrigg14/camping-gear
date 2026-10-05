import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { getCategories, getFeaturedProducts, getTopRated, site } from "@basecamp/shared";

export default function Home() {
  const categories = getCategories();
  return (
    <>
      <section className="relative overflow-hidden bg-forest-900 text-canvas-50">
        <svg
          className="absolute inset-x-0 bottom-0 h-40 w-full"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon points="0,160 0,90 200,20 380,110 560,10 760,100 960,30 1200,110 1200,160" fill="#2f4430" />
          <polygon points="0,160 0,130 260,70 480,140 700,60 940,130 1200,80 1200,160" fill="#3f5a3c" />
        </svg>
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ember-500">{site.tagline}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
            Gear up for your next night under the stars.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-canvas-200">{site.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#categories"
              className="rounded-md bg-ember-500 px-5 py-3 font-semibold text-white hover:bg-ember-600"
            >
              Browse gear
            </Link>
            <Link
              href="/search"
              className="rounded-md border border-canvas-200/50 px-5 py-3 font-semibold hover:bg-forest-800"
            >
              Search
            </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-14">
        <h2 className="text-3xl font-bold">Shop by category</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/gear/${c.slug}`}
              className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-lg border-2 border-bark-700"
            >
              <Image
                src={c.image}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition group-hover:scale-105"
              />
              <div className="relative w-full bg-gradient-to-t from-bark-900/90 to-transparent p-5 pt-16 text-canvas-50">
                <h3 className="text-2xl font-bold">{c.name}</h3>
                <p className="text-sm text-canvas-200">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-canvas-200 bg-canvas-100/70">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-bold">Featured gear</h2>
          <p className="mt-1 text-bark-700">Our current favorites across every category.</p>
          <div className="mt-6">
            <ProductGrid products={getFeaturedProducts()} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-bold">Top rated</h2>
        <div className="mt-6">
          <ProductGrid products={getTopRated(6)} />
        </div>
      </section>
    </>
  );
}
