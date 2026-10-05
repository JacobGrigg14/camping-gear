import {
  addItem as addItemDb,
  createTrip as createTripDb,
  CUSTOM_SECTION,
  deleteTrip as deleteTripDb,
  fetchTrips,
  removeItem as removeItemDb,
  setItemChecked,
  type Trip,
  type TripItem,
} from "@basecamp/shared";
import { create } from "zustand";
import { showError } from "@/lib/confirm";
import { supabase } from "@/lib/supabase";

export { CUSTOM_SECTION };
export type { Trip, TripItem };

type TripsState = {
  trips: Trip[];
  /** True once the signed-in user's trips have loaded at least once. */
  loaded: boolean;
  load: () => Promise<void>;
  clear: () => void;
  createTrip: (name: string, templateId?: string) => Promise<string | undefined>;
  deleteTrip: (id: string) => void;
  toggleItem: (tripId: string, itemId: string) => void;
  addItem: (tripId: string, label: string) => Promise<void>;
  removeItem: (tripId: string, itemId: string) => void;
};

function updateTrip(trips: Trip[], id: string, fn: (t: Trip) => Trip): Trip[] {
  return trips.map((t) => (t.id === id ? fn(t) : t));
}

/**
 * The signed-in user's trip checklists, kept in Supabase.
 * Changes show immediately and are rolled back if the write fails.
 */
export const useTrips = create<TripsState>()((set, get) => {
  async function optimistic(change: (trips: Trip[]) => Trip[], write: () => Promise<void>) {
    const previous = get().trips;
    set({ trips: change(previous) });
    try {
      await write();
    } catch {
      set({ trips: previous });
      showError();
    }
  }

  return {
    trips: [],
    loaded: false,
    load: async () => {
      if (!supabase) return;
      try {
        set({ trips: await fetchTrips(supabase), loaded: true });
      } catch {
        // Keep whatever we had; the next focus or sign-in retries.
      }
    },
    clear: () => set({ trips: [], loaded: false }),
    createTrip: async (name, templateId) => {
      if (!supabase) return;
      try {
        const trip = await createTripDb(supabase, name, templateId);
        set((s) => ({ trips: [trip, ...s.trips] }));
        return trip.id;
      } catch {
        showError("Couldn't create the trip. Try again.");
      }
    },
    deleteTrip: (id) => {
      const sb = supabase;
      if (!sb) return;
      optimistic(
        (trips) => trips.filter((t) => t.id !== id),
        () => deleteTripDb(sb, id),
      );
    },
    toggleItem: (tripId, itemId) => {
      const sb = supabase;
      const item = get()
        .trips.find((t) => t.id === tripId)
        ?.items.find((i) => i.id === itemId);
      if (!sb || !item) return;
      optimistic(
        (trips) =>
          updateTrip(trips, tripId, (t) => ({
            ...t,
            items: t.items.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i)),
          })),
        () => setItemChecked(sb, itemId, !item.checked),
      );
    },
    addItem: async (tripId, label) => {
      if (!supabase) return;
      try {
        const item = await addItemDb(supabase, tripId, label);
        set((s) => ({ trips: updateTrip(s.trips, tripId, (t) => ({ ...t, items: [...t.items, item] })) }));
      } catch {
        showError("Couldn't add that item. Try again.");
      }
    },
    removeItem: (tripId, itemId) => {
      const sb = supabase;
      if (!sb) return;
      optimistic(
        (trips) => updateTrip(trips, tripId, (t) => ({ ...t, items: t.items.filter((i) => i.id !== itemId) })),
        () => removeItemDb(sb, itemId),
      );
    },
  };
});
