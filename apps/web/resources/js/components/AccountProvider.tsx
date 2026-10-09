import { router, usePage } from "@inertiajs/react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { GearList } from "@basecamp/shared";
import { api } from "@/lib/api";

type Account = {
  user: { id: number; name: string; email: string } | null;
  lists: GearList[];
  favorites: GearList | undefined;
  setSaved: (listId: string, productId: string, saved: boolean) => Promise<void>;
  newList: (name: string, productId?: string) => Promise<string>;
  /** Re-reads lists after changes made elsewhere (list pages, another device). */
  refreshLists: () => void;
};

const AccountContext = createContext<Account | null>(null);

export function useAccount(): Account {
  const account = useContext(AccountContext);
  if (!account) throw new Error("useAccount must be used inside <AccountProvider>");
  return account;
}

/**
 * Holds the signed-in user's lists so hearts on every page know what's saved. The server sends
 * the lists with each page (a shared Inertia prop); changes are applied here straight away and
 * written through the API.
 */
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { auth, lists: serverLists } = usePage().props;
  const [lists, setLists] = useState(serverLists);
  // A fresh copy from the server (any page visit) replaces local state.
  const [lastServerLists, setLastServerLists] = useState(serverLists);
  if (serverLists !== lastServerLists) {
    setLastServerLists(serverLists);
    setLists(serverLists);
  }

  const setSaved = useCallback(async (listId: string, productId: string, saved: boolean) => {
    const apply = (on: boolean) =>
      setLists((ls) =>
        ls.map((l) =>
          l.id !== listId
            ? l
            : {
                ...l,
                productIds: on
                  ? [productId, ...l.productIds.filter((p) => p !== productId)]
                  : l.productIds.filter((p) => p !== productId),
              },
        ),
      );
    apply(saved);
    try {
      await api.setProductInList(listId, productId, saved);
    } catch (e) {
      apply(!saved);
      throw e;
    }
  }, []);

  const newList = useCallback(async (name: string, productId?: string) => {
    const list = await api.createList(name, productId);
    setLists((ls) => [...ls, list]);
    return list.id;
  }, []);

  const refreshLists = useCallback(() => router.reload({ only: ["lists"] }), []);

  const value = useMemo(
    () => ({
      user: auth.user,
      lists,
      favorites: lists.find((l) => l.isFavorites),
      setSaved,
      newList,
      refreshLists,
    }),
    [auth.user, lists, setSaved, newList, refreshLists],
  );
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}
