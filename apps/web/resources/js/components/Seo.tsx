import { Head, usePage } from "@inertiajs/react";
import { site } from "@basecamp/shared";

/** Page title plus description, canonical URL and Open Graph tags (rendered on the server). */
export function Seo({
  title,
  description = site.description,
  canonical,
  image,
  type = "website",
  noindex = false,
}: {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  /** Open Graph type; product pages use "product". */
  type?: "website" | "product";
  noindex?: boolean;
}) {
  const { siteUrl } = usePage().props;
  const absolute = (path: string) => new URL(path, `${siteUrl}/`).toString();
  const imageUrl = absolute(image ?? "/og-image.png");
  return (
    <Head title={title}>
      <meta head-key="description" name="description" content={description} />
      {canonical && <link head-key="canonical" rel="canonical" href={absolute(canonical)} />}
      {noindex && <meta head-key="robots" name="robots" content="noindex" />}
      <meta head-key="og:site_name" property="og:site_name" content={site.name} />
      <meta head-key="og:type" property="og:type" content={type} />
      {canonical && <meta head-key="og:url" property="og:url" content={absolute(canonical)} />}
      <meta head-key="og:title" property="og:title" content={title ?? site.name} />
      <meta head-key="og:description" property="og:description" content={description} />
      <meta head-key="og:image" property="og:image" content={imageUrl} />
      <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta head-key="twitter:title" name="twitter:title" content={title ?? site.name} />
      <meta head-key="twitter:description" name="twitter:description" content={description} />
      <meta head-key="twitter:image" name="twitter:image" content={imageUrl} />
    </Head>
  );
}
