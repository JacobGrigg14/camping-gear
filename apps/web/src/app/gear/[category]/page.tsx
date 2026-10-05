import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { DisclosureNote } from "@/components/DisclosureNote";
import { getCategories, getCategory, getProductsByCategory } from "@basecamp/shared";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gear/[category]">): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return {
    title: `Best ${category.name} Gear`,
    description: category.description,
    alternates: { canonical: `/gear/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/gear/[category]">) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.name }]} />
      <header className="mt-4 mb-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold">{category.name}</h1>
        <p className="mt-2 text-lg text-bark-700">{category.description}</p>
        <div className="mt-3">
          <DisclosureNote />
        </div>
      </header>
      <CategoryBrowser products={getProductsByCategory(category.slug)} subcategories={category.subcategories} />
    </div>
  );
}
