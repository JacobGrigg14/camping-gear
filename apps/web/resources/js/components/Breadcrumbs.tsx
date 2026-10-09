import { Link, usePage } from "@inertiajs/react";
import { JsonLd } from "./JsonLd";

/** Breadcrumb trail, plus matching BreadcrumbList structured data for search results. */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const { siteUrl } = usePage().props;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-bark-500">
      <JsonLd
        id="breadcrumbs-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            ...(item.href && { item: new URL(item.href, `${siteUrl}/`).toString() }),
          })),
        }}
      />
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-ember-600">
                {item.label}
              </Link>
            ) : (
              <span className="text-bark-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
