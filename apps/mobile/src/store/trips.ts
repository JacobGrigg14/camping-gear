import { CUSTOM_SECTION, type Trip, type TripItem } from "@basecamp/shared";
import { create } from "zustand";
import { api } from "@/lib/api";
import { showError } from "@/lib/confirm";

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
 * The signed-in user's trip checklists, kept on the website (Laravel API).
 * Changes show immediately and are rolled back if the write fails.
 */
export const useTrips = create<TripsState>()((set, get) => {
  async function optimistic(change: (trips: Trip[]) => Trip[], write: () => Promise<unknown>) {
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
      if (!api) return;
      try {
        set({ trips: await api.fetchTrips(), loaded: true });
      } catch {
        // Keep whatever we had; the next focus or sign-in retries.
      }
    },
    clear: () => set({ trips: [], loaded: false }),
    createTrip: async (name, templateId) => {
      if (!api) return;
      try {
        const trip = await api.createTrip(name, templateId);
        set((s) => ({ trips: [trip, ...s.trips] }));
        return trip.id;
      } catch {
        showError("Couldn't create the trip. Try again.");
      }
    },
    deleteTrip: (id) => {
      const client = api;
      if (!client) return;
      optimistic(
        (trips) => trips.filter((t) => t.id !== id),
        () => client.deleteTrip(id),
      );
    },
    toggleItem: (tripId, itemId) => {
      const client = api;
      const item = get()
        .trips.find((t) => t.id === tripId)
        ?.items.find((i) => i.id === itemId);
      if (!client || !item) return;
      optimistic(
        (trips) =>
          updateTrip(trips, tripId, (t) => ({
            ...t,
            items: t.items.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i)),
          })),
        () => client.setItemChecked(itemId, !item.checked),
      );
    },
    addItem: async (tripId, label) => {
      if (!api) return;
      try {
        const item = await api.addItem(tripId, label);
        set((s) => ({ trips: updateTrip(s.trips, tripId, (t) => ({ ...t, items: [...t.items, item] })) }));
      } catch {
        showError("Couldn't add that item. Try again.");
      }
    },
    removeItem: (tripId, itemId) => {
      const client = api;
      if (!client) return;
      optimistic(
        (trips) => updateTrip(trips, tripId, (t) => ({ ...t, items: t.items.filter((i) => i.id !== itemId) })),
        () => client.removeItem(itemId),
      );
    },
  };
});
