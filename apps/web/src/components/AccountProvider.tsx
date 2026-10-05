"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createList, fetchLists, type GearList, setProductInList } from "@basecamp/shared";
import { getBrowserClient } from "@/lib/supabase/client";

type Account = {
  /** False until the first session check finishes (avoids flashing "Sign in"). */
  ready: boolean;
  user: User | null;
  lists: GearList[];
  favorites: GearList | undefined;
  setSaved: (listId: string, productId: string, saved: boolean) => Promise<void>;
  newList: (name: string, productId?: string) => Promise<string | undefined>;
  /** Re-reads lists after changes made elsewhere (list pages, another device). */
  refreshLists: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AccountContext = createContext<Account | null>(null);

export function useAccount(): Account {
  const account = useContext(AccountContext);
  if (!account) throw new Error("useAccount must be used inside <AccountProvider>");
  return account;
}

/** Holds the signed-in user and their lists so hearts on static pages know what's saved. */
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const sb = getBrowserClient();
  const [ready, setReady] = useState(!sb);
  const [user, setUser] = useState<User | null>(null);
  // Lists are tagged with the user they belong to, so signing out (or switching accounts) hides them immediately.
  const [owned, setOwned] = useState<{ userId: string; lists: GearList[] } | null>(null);

  useEffect(() => {
    if (!sb) return;
    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, [sb]);

  const userId = user?.id;
  const lists = useMemo(() => (userId && owned?.userId === userId ? owned.lists : []), [owned, userId]);
  const setLists = useCallback(
    (change: (lists: GearList[]) => GearList[]) => setOwned((o) => o && { ...o, lists: change(o.lists) }),
    [],
  );

  useEffect(() => {
    if (!sb || !userId) return;
    let cancelled = false;
    fetchLists(sb)
      .then((l) => !cancelled && setOwned({ userId, lists: l }))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [sb, userId]);

  const refreshLists = useCallback(async () => {
    if (!sb || !userId) return;
    const l = await fetchLists(sb);
    setOwned({ userId, lists: l });
  }, [sb, userId]);

  const setSaved = useCallback(
    async (listId: string, productId: string, saved: boolean) => {
      if (!sb) return;
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
        await setProductInList(sb, listId, productId, saved);
      } catch (e) {
        apply(!saved);
        throw e;
      }
    },
    [sb, setLists],
  );

  const newList = useCallback(
    async (name: string, productId?: string) => {
      if (!sb) return;
      const list = await createList(sb, name, productId);
      setLists((ls) => [...ls, list]);
      return list.id;
    },
    [sb, setLists],
  );

  const signOut = useCallback(async () => {
    await sb?.auth.signOut();
  }, [sb]);

  const value = useMemo(
    () => ({
      ready,
      user,
      lists,
      favorites: lists.find((l) => l.isFavorites),
      setSaved,
      newList,
      refreshLists,
      signOut,
    }),
    [ready, user, lists, setSaved, newList, refreshLists, signOut],
  );
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}
