import { Link } from "@inertiajs/react";
import type { Trip } from "@basecamp/shared";
import { TripChecklist } from "@/components/trips/TripChecklist";
import { Seo } from "@/components/Seo";

export default function TripPage({ trip, productPaths }: { trip: Trip; productPaths: Record<string, string> }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Seo title={trip.name} noindex />
      <Link href="/trips" className="text-sm font-semibold text-forest-700 hover:underline">
        ← Trips
      </Link>
      <h1 className="mt-2 text-4xl font-extrabold">{trip.name}</h1>
      <TripChecklist key={trip.id} initialTrip={trip} productPaths={productPaths} />
    </div>
  );
}
