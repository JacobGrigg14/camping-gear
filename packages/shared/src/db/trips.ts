import { getChecklistTemplate, type ChecklistItemTemplate } from "../checklists";
import type { CategorySlug } from "../types";
import { check, unwrap, type BasecampClient } from "./client";
import type { Database } from "./database.types";

export type TripItem = ChecklistItemTemplate & {
  id: string;
  section: string;
  checked: boolean;
};

export type Trip = {
  id: string;
  name: string;
  templateId?: string;
  createdAt: string;
  items: TripItem[];
};

/** Section for items the user adds themselves. */
export const CUSTOM_SECTION = "My items";

/** Custom items sort after template items, then by when they were added. */
const CUSTOM_POSITION = 1_000_000;

type ItemRow = Database["public"]["Tables"]["trip_items"]["Row"];
type ItemInsert = Database["public"]["Tables"]["trip_items"]["Insert"];

const TRIP_SELECT = "id, name, template_id, created_at, trip_items(*)";

function toItem(row: ItemRow): TripItem {
  return {
    id: row.id,
    label: row.label,
    section: row.section,
    checked: row.checked,
    productSlug: row.product_slug ?? undefined,
    gear:
      row.gear_category && row.gear_subcategory
        ? { category: row.gear_category as CategorySlug, subcategory: row.gear_subcategory }
        : undefined,
  };
}

function toTrip(row: {
  id: string;
  name: string;
  template_id: string | null;
  created_at: string;
  trip_items: ItemRow[];
}): Trip {
  return {
    id: row.id,
    name: row.name,
    templateId: row.template_id ?? undefined,
    createdAt: row.created_at,
    items: [...row.trip_items]
      .sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at))
      .map(toItem),
  };
}

/** The signed-in user's trips, newest first. */
export async function fetchTrips(sb: BasecampClient): Promise<Trip[]> {
  const rows = unwrap(await sb.from("trips").select(TRIP_SELECT).order("created_at", { ascending: false }));
  return rows.map(toTrip);
}

export async function fetchTrip(sb: BasecampClient, id: string): Promise<Trip | null> {
  const result = await sb.from("trips").select(TRIP_SELECT).eq("id", id).maybeSingle();
  check(result);
  return result.data ? toTrip(result.data) : null;
}

/** Creates a trip, copying the template's items if one is given. */
export async function createTrip(sb: BasecampClient, name: string, templateId?: string): Promise<Trip> {
  const trip = unwrap(
    await sb
      .from("trips")
      .insert({ name, template_id: templateId ?? null })
      .select("id")
      .single(),
  );
  const template = templateId ? getChecklistTemplate(templateId) : undefined;
  const items: ItemInsert[] =
    template?.sections.flatMap((section) =>
      section.items.map((item) => ({
        trip_id: trip.id,
        label: item.label,
        section: section.title,
        product_slug: item.productSlug ?? null,
        gear_category: item.gear?.category ?? null,
        gear_subcategory: item.gear?.subcategory ?? null,
      })),
    ) ?? [];
  items.forEach((item, i) => (item.position = i));
  if (items.length) check(await sb.from("trip_items").insert(items));

  const created = await fetchTrip(sb, trip.id);
  if (!created) throw new Error("Trip was not created");
  return created;
}

export async function deleteTrip(sb: BasecampClient, id: string): Promise<void> {
  check(await sb.from("trips").delete().eq("id", id));
}

export async function setItemChecked(sb: BasecampClient, itemId: string, checked: boolean): Promise<void> {
  check(await sb.from("trip_items").update({ checked }).eq("id", itemId));
}

/** Adds a custom item at the end of the trip's checklist. */
export async function addItem(sb: BasecampClient, tripId: string, label: string): Promise<TripItem> {
  const row = unwrap(
    await sb
      .from("trip_items")
      .insert({ trip_id: tripId, label, section: CUSTOM_SECTION, position: CUSTOM_POSITION })
      .select()
      .single(),
  );
  return toItem(row);
}

export async function removeItem(sb: BasecampClient, itemId: string): Promise<void> {
  check(await sb.from("trip_items").delete().eq("id", itemId));
}
