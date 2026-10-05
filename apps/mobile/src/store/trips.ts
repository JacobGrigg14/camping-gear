import AsyncStorage from "@react-native-async-storage/async-storage";
import { getChecklistTemplate, type ChecklistItemTemplate } from "@basecamp/shared";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { newId } from "@/lib/id";

export type TripItem = ChecklistItemTemplate & {
  id: string;
  section: string;
  checked: boolean;
};

export type Trip = {
  id: string;
  name: string;
  templateId?: string;
  createdAt: number;
  items: TripItem[];
};

export const CUSTOM_SECTION = "My items";

type TripsState = {
  trips: Trip[];
  createTrip: (name: string, templateId?: string) => string;
  deleteTrip: (id: string) => void;
  toggleItem: (tripId: string, itemId: string) => void;
  addItem: (tripId: string, label: string) => void;
  removeItem: (tripId: string, itemId: string) => void;
};

function updateTrip(trips: Trip[], id: string, fn: (t: Trip) => Trip): Trip[] {
  return trips.map((t) => (t.id === id ? fn(t) : t));
}

export const useTrips = create<TripsState>()(
  persist(
    (set) => ({
      trips: [],
      createTrip: (name, templateId) => {
        const id = newId();
        const template = templateId ? getChecklistTemplate(templateId) : undefined;
        const items: TripItem[] =
          template?.sections.flatMap((section) =>
            section.items.map((item) => ({ ...item, id: newId(), section: section.title, checked: false })),
          ) ?? [];
        set((s) => ({ trips: [{ id, name, templateId, createdAt: Date.now(), items }, ...s.trips] }));
        return id;
      },
      deleteTrip: (id) => set((s) => ({ trips: s.trips.filter((t) => t.id !== id) })),
      toggleItem: (tripId, itemId) =>
        set((s) => ({
          trips: updateTrip(s.trips, tripId, (t) => ({
            ...t,
            items: t.items.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i)),
          })),
        })),
      addItem: (tripId, label) =>
        set((s) => ({
          trips: updateTrip(s.trips, tripId, (t) => ({
            ...t,
            items: [...t.items, { id: newId(), label, section: CUSTOM_SECTION, checked: false }],
          })),
        })),
      removeItem: (tripId, itemId) =>
        set((s) => ({
          trips: updateTrip(s.trips, tripId, (t) => ({ ...t, items: t.items.filter((i) => i.id !== itemId) })),
        })),
    }),
    {
      name: "basecamp-trips",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
