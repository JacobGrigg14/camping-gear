import { Link } from "@inertiajs/react";
import type { ChecklistTemplate, Trip } from "@basecamp/shared";
import { NewTripForm } from "@/components/trips/NewTripForm";
import { Seo } from "@/components/Seo";

export default function TripsPage({ trips, templates }: { trips: Trip[]; templates: ChecklistTemplate[] }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Seo title="Trips" noindex />
      <h1 className="text-4xl font-extrabold">Trips</h1>
      <p className="mt-2 text-bark-700">Packing checklists for your next trip. Check things off here or in the app.</p>

      {trips.length > 0 && (
        <ul className="mt-8 space-y-3">
          {trips.map((trip) => {
            const done = trip.items.filter((i) => i.checked).length;
            const pct = trip.items.length ? Math.round((done / trip.items.length) * 100) : 0;
            return (
              <li key={trip.id}>
                <Link
                  href={`/trips/${trip.id}`}
                  className="block rounded-lg border border-canvas-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-bold">{trip.name}</h2>
                    <span className="text-sm text-bark-500">
                      {done} of {trip.items.length} packed
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-canvas-100">
                    <div className="h-full rounded-full bg-forest-700" style={{ width: `${pct}%` }} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Plan a new trip</h2>
        <NewTripForm templates={templates.map(({ id, name, description }) => ({ id, name, description }))} />
      </section>
    </div>
  );
}
