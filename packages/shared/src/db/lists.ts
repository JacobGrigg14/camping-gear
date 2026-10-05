import { check, unwrap, type BasecampClient } from "./client";

export type GearList = {
  id: string;
  name: string;
  isFavorites: boolean;
  /** Most recently saved first. */
  productIds: string[];
  createdAt: string;
};

/** All of the signed-in user's lists, Favorites first, then oldest to newest. */
export async function fetchLists(sb: BasecampClient): Promise<GearList[]> {
  const rows = unwrap(
    await sb
      .from("lists")
      .select("id, name, is_favorites, created_at, list_items(product_id, created_at)")
      .order("is_favorites", { ascending: false })
      .order("created_at"),
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    isFavorites: row.is_favorites,
    createdAt: row.created_at,
    productIds: [...row.list_items]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((item) => item.product_id),
  }));
}

export async function fetchList(sb: BasecampClient, id: string): Promise<GearList | null> {
  const lists = await fetchLists(sb);
  return lists.find((l) => l.id === id) ?? null;
}

export async function createList(sb: BasecampClient, name: string, productId?: string): Promise<GearList> {
  const row = unwrap(await sb.from("lists").insert({ name }).select().single());
  if (productId) await setProductInList(sb, row.id, productId, true);
  return {
    id: row.id,
    name: row.name,
    isFavorites: row.is_favorites,
    createdAt: row.created_at,
    productIds: productId ? [productId] : [],
  };
}

export async function renameList(sb: BasecampClient, id: string, name: string): Promise<void> {
  check(await sb.from("lists").update({ name }).eq("id", id));
}

/** Favorites can't be deleted (also enforced by a database policy). */
export async function deleteList(sb: BasecampClient, id: string): Promise<void> {
  check(await sb.from("lists").delete().eq("id", id).eq("is_favorites", false));
}

export async function setProductInList(
  sb: BasecampClient,
  listId: string,
  productId: string,
  saved: boolean,
): Promise<void> {
  if (saved) {
    check(await sb.from("list_items").upsert({ list_id: listId, product_id: productId }, { ignoreDuplicates: true }));
  } else {
    check(await sb.from("list_items").delete().eq("list_id", listId).eq("product_id", productId));
  }
}
