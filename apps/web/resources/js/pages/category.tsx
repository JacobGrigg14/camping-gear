import type { Category, Product } from "@basecamp/shared";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { DisclosureNote } from "@/components/DisclosureNote";
import { Seo } from "@/components/Seo";

export default function CategoryPage({ category, products }: { category: Category; products: Product[] }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Seo
        title={`Best ${category.name} Gear`}
        description={category.description}
        canonical={`/gear/${category.slug}`}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.name }]} />
      <header className="mt-4 mb-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold">{category.name}</h1>
        <p className="mt-2 text-lg text-bark-700">{category.description}</p>
        <div className="mt-3">
          <DisclosureNote />
        </div>
      </header>
      <CategoryBrowser products={products} subcategories={category.subcategories} />
    </div>
  );
}
