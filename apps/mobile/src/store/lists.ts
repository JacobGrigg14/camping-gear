import {
  createList as createListDb,
  deleteList as deleteListDb,
  fetchLists,
  type GearList,
  renameList as renameListDb,
  setProductInList,
} from "@basecamp/shared";
import { create } from "zustand";
import { showError } from "@/lib/confirm";
import { supabase } from "@/lib/supabase";

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
 * The signed-in user's gear lists, kept in Supabase.
 * Changes show immediately and are rolled back if the write fails.
 */
export const useLists = create<ListsState>()((set, get) => {
  /** Applies a local change, runs the write, and restores the previous lists on failure. */
  async function optimistic(change: (lists: GearList[]) => GearList[], write: () => Promise<void>) {
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
      if (!supabase) return;
      try {
        set({ lists: await fetchLists(supabase), loaded: true });
      } catch {
        // Keep whatever we had; the next focus or sign-in retries.
      }
    },
    clear: () => set({ lists: [], loaded: false }),
    createList: async (name, productId) => {
      if (!supabase) return;
      try {
        const list = await createListDb(supabase, name, productId);
        set((s) => ({ lists: [...s.lists, list] }));
        return list.id;
      } catch {
        showError("Couldn't create the list. Try again.");
      }
    },
    renameList: (id, name) => {
      if (!supabase) return;
      const sb = supabase;
      optimistic(
        (lists) => lists.map((l) => (l.id === id ? { ...l, name } : l)),
        () => renameListDb(sb, id, name),
      );
    },
    deleteList: (id) => {
      if (!supabase) return;
      const sb = supabase;
      optimistic(
        (lists) => lists.filter((l) => l.id !== id || l.isFavorites),
        () => deleteListDb(sb, id),
      );
    },
    toggleProduct: (listId, productId) => {
      const sb = supabase;
      const list = get().lists.find((l) => l.id === listId);
      if (!sb || !list) return;
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
        () => setProductInList(sb, listId, productId, saved),
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
