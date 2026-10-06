import { Head, usePage } from "@inertiajs/react";
import { site } from "@basecamp/shared";

/** Page title plus description, canonical URL and Open Graph tags (rendered on the server). */
export function Seo({
  title,
  description = site.description,
  canonical,
  image,
  noindex = false,
}: {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
}) {
  const { siteUrl } = usePage().props;
  const absolute = (path: string) => new URL(path, `${siteUrl}/`).toString();
  return (
    <Head title={title}>
      <meta head-key="description" name="description" content={description} />
      {canonical && <link head-key="canonical" rel="canonical" href={absolute(canonical)} />}
      {noindex && <meta head-key="robots" name="robots" content="noindex" />}
      <meta head-key="og:site_name" property="og:site_name" content={site.name} />
      <meta head-key="og:type" property="og:type" content="website" />
      <meta head-key="og:title" property="og:title" content={title ?? site.name} />
      <meta head-key="og:description" property="og:description" content={description} />
      <meta head-key="og:image" property="og:image" content={absolute(image ?? "/og-image.png")} />
    </Head>
  );
}
