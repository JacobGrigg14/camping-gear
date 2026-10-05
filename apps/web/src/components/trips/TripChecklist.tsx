"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  addItem,
  CUSTOM_SECTION,
  deleteTrip,
  getProduct,
  productPath,
  removeItem,
  setItemChecked,
  type Trip,
  type TripItem,
} from "@basecamp/shared";
import { getBrowserClient } from "@/lib/supabase/client";
import { inputClass } from "../auth/ui";

/** Checklist with optimistic updates; each change is written straight to Supabase. */
export function TripChecklist({ initialTrip }: { initialTrip: Trip }) {
  const router = useRouter();
  const [trip, setTrip] = useState(initialTrip);
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");

  const sections = [...new Set(trip.items.map((i) => i.section))];
  const done = trip.items.filter((i) => i.checked).length;

  /** Applies `change` locally, runs `write`, and restores the previous state if it fails. */
  async function mutate(change: (t: Trip) => Trip, write: () => Promise<unknown>) {
    const previous = trip;
    setTrip(change);
    setError("");
    try {
      await write();
    } catch {
      setTrip(previous);
      setError("Couldn't save that change. Check your connection and try again.");
    }
  }

  const sb = getBrowserClient();
  if (!sb) return null;

  const toggle = (item: TripItem) =>
    mutate(
      (t) => ({ ...t, items: t.items.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i)) }),
      () => setItemChecked(sb, item.id, !item.checked),
    );

  const remove = (item: TripItem) =>
    mutate(
      (t) => ({ ...t, items: t.items.filter((i) => i.id !== item.id) }),
      () => removeItem(sb, item.id),
    );

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const label = newItem.trim();
    if (!label || !sb) return;
    setNewItem("");
    setError("");
    try {
      const item = await addItem(sb, trip.id, label);
      setTrip((t) => ({ ...t, items: [...t.items, item] }));
    } catch {
      setNewItem(label);
      setError("Couldn't add that item. Try again.");
    }
  }

  async function onDelete() {
    if (!sb || !confirm(`Delete “${trip.name}” and its checklist?`)) return;
    try {
      await deleteTrip(sb, trip.id);
      router.replace("/trips");
      router.refresh();
    } catch {
      setError("Couldn't delete the trip. Try again.");
    }
  }

  return (
    <div>
      <p className="mt-2 text-bark-700">
        {done} of {trip.items.length} packed
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-canvas-100">
        <div
          className="h-full rounded-full bg-forest-700 transition-all"
          style={{ width: `${trip.items.length ? (done / trip.items.length) * 100 : 0}%` }}
        />
      </div>

      {sections.map((section) => (
        <section key={section} className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-bark-500">{section}</h2>
          <ul className="mt-2 divide-y divide-canvas-200 rounded-lg border border-canvas-200 bg-white">
            {trip.items
              .filter((i) => i.section === section)
              .map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onToggle={() => toggle(item)}
                  onRemove={item.section === CUSTOM_SECTION ? () => remove(item) : undefined}
                />
              ))}
          </ul>
        </section>
      ))}

      <form onSubmit={add} className="mt-8 flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add your own item"
          aria-label="New checklist item"
          maxLength={120}
          className={inputClass}
        />
        <button
          type="submit"
          disabled={!newItem.trim()}
          className="shrink-0 rounded-md bg-forest-700 px-4 font-semibold text-white hover:bg-forest-800 disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button type="button" onClick={onDelete} className="mt-10 text-sm font-semibold text-red-700 hover:underline">
        Delete trip
      </button>
    </div>
  );
}

function ItemRow({ item, onToggle, onRemove }: { item: TripItem; onToggle: () => void; onRemove?: () => void }) {
  const product = item.productSlug ? getProduct(item.productSlug) : undefined;
  const link = product
    ? { href: productPath(product), label: "Our pick" }
    : item.gear
      ? { href: `/gear/${item.gear.category}?type=${item.gear.subcategory}`, label: "Browse" }
      : null;

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <input
        id={`item-${item.id}`}
        type="checkbox"
        checked={item.checked}
        onChange={onToggle}
        className="h-5 w-5 shrink-0 accent-forest-700"
      />
      <label
        htmlFor={`item-${item.id}`}
        className={`flex-1 cursor-pointer ${item.checked ? "text-bark-500 line-through" : ""}`}
      >
        {item.label}
      </label>
      {link && (
        <Link href={link.href} className="shrink-0 text-sm font-semibold text-ember-600 hover:underline">
          {link.label} →
        </Link>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.label}`}
          className="shrink-0 px-1 text-lg leading-none text-bark-500 hover:text-red-700"
        >
          ×
        </button>
      )}
    </li>
  );
}
