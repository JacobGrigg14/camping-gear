import type { LegalDoc } from "@basecamp/shared";
import { Seo } from "@/components/Seo";

/** Renders a privacy policy or terms document from packages/shared. */
export function LegalPage({ doc, canonical }: { doc: LegalDoc; canonical: string }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Seo title={doc.title} canonical={canonical} />
      <h1 className="text-4xl font-extrabold">{doc.title}</h1>
      <p className="mt-2 text-sm text-bark-500">Last updated {doc.updated}</p>
      {doc.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-xl font-bold">{section.heading}</h2>
          <div className="mt-3 space-y-4 leading-relaxed text-bark-700">
            {section.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
