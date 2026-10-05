import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchLists, getProductById } from "@basecamp/shared";
import { NewListForm } from "@/components/account/NewListForm";
import { requireUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My Gear", robots: { index: false } };

export default async function MyGearPage() {
  const { sb } = await requireUser("/my-gear");
  const lists = await fetchLists(sb);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-extrabold">My Gear</h1>
      <p className="mt-2 text-bark-700">
        Your saved gear. Everything here also shows up in the Basecamp app when you sign in.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((list) => {
          const thumbs = list.productIds
            .slice(0, 3)
            .map(getProductById)
            .filter((p) => p !== undefined);
          return (
            <li key={list.id}>
              <Link
                href={`/my-gear/${list.id}`}
                className="flex h-full flex-col rounded-lg border border-canvas-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid aspect-[3/1] grid-cols-3 gap-1 overflow-hidden rounded-md bg-canvas-100">
                  {thumbs.map((p) => (
                    <div key={p.id} className="relative">
                      <Image src={p.images[0]} alt="" fill sizes="120px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <h2 className="mt-3 text-xl font-bold">
                  {list.isFavorites && <span aria-hidden="true">♥ </span>}
                  {list.name}
                </h2>
                <p className="text-sm text-bark-500">
                  {list.productIds.length} {list.productIds.length === 1 ? "item" : "items"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 max-w-md">
        <h2 className="text-xl font-bold">Start a new list</h2>
        <p className="mt-1 text-sm text-bark-700">
          Group gear into kits like “Winter backpacking” or “Family car camping”.
        </p>
        <NewListForm />
      </div>
    </div>
  );
}
