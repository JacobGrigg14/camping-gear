import { Head } from "@inertiajs/react";

/** Structured data (schema.org JSON-LD) in the page head, rendered on the server. */
export function JsonLd({ id, data }: { id: string; data: Record<string, unknown> }) {
  return (
    <Head>
      <script
        head-key={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      />
    </Head>
  );
}
