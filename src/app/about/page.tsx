import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-extrabold">About {site.name}</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-bark-700">
        <p>
          {site.name} is a small team of campers, backpackers and weekend warriors who want to help you spend less time
          researching gear and more time outside.
        </p>
        <p>
          We pick gear across every budget, from first-time car campers to thru-hikers, and tell you what we like and
          what we don&apos;t. Placeholder copy. Replace with your story.
        </p>
      </div>
    </article>
  );
}
