import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchTrip } from "@basecamp/shared";
import { TripChecklist } from "@/components/trips/TripChecklist";
import { requireUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Trip checklist", robots: { index: false } };

export default async function TripPage({ params }: PageProps<"/trips/[id]">) {
  const { id } = await params;
  const { sb } = await requireUser(`/trips/${id}`);
  const trip = await fetchTrip(sb, id);
  if (!trip) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/trips" className="text-sm font-semibold text-forest-700 hover:underline">
        ← Trips
      </Link>
      <h1 className="mt-2 text-4xl font-extrabold">{trip.name}</h1>
      <TripChecklist key={trip.id} initialTrip={trip} />
    </div>
  );
}
