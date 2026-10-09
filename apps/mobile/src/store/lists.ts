import type { GearList } from "@basecamp/shared";
import { create } from "zustand";
import { api } from "@/lib/api";
import { showError } from "@/lib/confirm";

export type { GearList };

type ListsState = {
  lists: GearList[];
  /** True once the signed-in user's lists have loaded at least once. */
  loaded: boolean;
  load: () => Promise<void>;
  clear: () => void;
  createList: (name: string, productId?: string) => Promise<string | undefined>;
  renameList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  toggleProduct: (listId: string, productId: string) => void;
};

/**
 * The signed-in user's gear lists, kept on the website (Laravel API).
 * Changes show immediately and are rolled back if the write fails.
 */
export const useLists = create<ListsState>()((set, get) => {
  /** Applies a local change, runs the write, and restores the previous lists on failure. */
  async function optimistic(change: (lists: GearList[]) => GearList[], write: () => Promise<unknown>) {
    const previous = get().lists;
    set({ lists: change(previous) });
    try {
      await write();
    } catch {
      set({ lists: previous });
      showError();
    }
  }

  return {
    lists: [],
    loaded: false,
    load: async () => {
      if (!api) return;
      try {
        set({ lists: await api.fetchLists(), loaded: true });
      } catch {
        // Keep whatever we had; the next focus or sign-in retries.
      }
    },
    clear: () => set({ lists: [], loaded: false }),
    createList: async (name, productId) => {
      if (!api) return;
      try {
        const list = await api.createList(name, productId);
        set((s) => ({ lists: [...s.lists, list] }));
        return list.id;
      } catch {
        showError("Couldn't create the list. Try again.");
      }
    },
    renameList: (id, name) => {
      if (!api) return;
      const client = api;
      optimistic(
        (lists) => lists.map((l) => (l.id === id ? { ...l, name } : l)),
        () => client.renameList(id, name),
      );
    },
    deleteList: (id) => {
      if (!api) return;
      const client = api;
      optimistic(
        (lists) => lists.filter((l) => l.id !== id || l.isFavorites),
        () => client.deleteList(id),
      );
    },
    toggleProduct: (listId, productId) => {
      const client = api;
      const list = get().lists.find((l) => l.id === listId);
      if (!client || !list) return;
      const saved = !list.productIds.includes(productId);
      optimistic(
        (lists) =>
          lists.map((l) =>
            l.id !== listId
              ? l
              : {
                  ...l,
                  productIds: saved ? [productId, ...l.productIds] : l.productIds.filter((p) => p !== productId),
                },
          ),
        () => client.setProductInList(listId, productId, saved),
      );
    },
  };
});

export function useFavoritesId(): string | undefined {
  return useLists((s) => s.lists.find((l) => l.isFavorites)?.id);
}

/** True if the product is in any list (drives the filled heart). */
export function useIsInAnyList(productId: string): boolean {
  return useLists((s) => s.lists.some((l) => l.productIds.includes(productId)));
}
