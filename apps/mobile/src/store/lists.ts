import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { newId } from "@/lib/id";

export const FAVORITES_ID = "favorites";

export type GearList = {
  id: string;
  name: string;
  productIds: string[];
  createdAt: number;
};

type ListsState = {
  lists: GearList[];
  createList: (name: string, productId?: string) => string;
  renameList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  toggleProduct: (listId: string, productId: string) => void;
};

const favorites: GearList = { id: FAVORITES_ID, name: "Favorites", productIds: [], createdAt: 0 };

export const useLists = create<ListsState>()(
  persist(
    (set) => ({
      lists: [favorites],
      createList: (name, productId) => {
        const id = newId();
        set((s) => ({
          lists: [...s.lists, { id, name, productIds: productId ? [productId] : [], createdAt: Date.now() }],
        }));
        return id;
      },
      renameList: (id, name) => set((s) => ({ lists: s.lists.map((l) => (l.id === id ? { ...l, name } : l)) })),
      deleteList: (id) => {
        if (id === FAVORITES_ID) return;
        set((s) => ({ lists: s.lists.filter((l) => l.id !== id) }));
      },
      toggleProduct: (listId, productId) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id !== listId
              ? l
              : {
                  ...l,
                  productIds: l.productIds.includes(productId)
                    ? l.productIds.filter((p) => p !== productId)
                    : [productId, ...l.productIds],
                },
          ),
        })),
    }),
    {
      name: "basecamp-lists",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useIsSaved(listId: string, productId: string): boolean {
  return useLists((s) => s.lists.find((l) => l.id === listId)?.productIds.includes(productId) ?? false);
}

/** True if the product is in any list (drives the filled heart). */
export function useIsInAnyList(productId: string): boolean {
  return useLists((s) => s.lists.some((l) => l.productIds.includes(productId)));
}
