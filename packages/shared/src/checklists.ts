import type { CategorySlug } from "./types";

export type ChecklistItemTemplate = {
  label: string;
  /** Recommend a specific product... */
  productSlug?: string;
  /** ...or a type of gear (category + subcategory) to browse. */
  gear?: { category: CategorySlug; subcategory: string };
};

/** A packing-list template that new trips copy from. Edited in the admin (/admin). */
export type ChecklistTemplate = {
  id: string;
  name: string;
  description: string;
  sections: { title: string; items: ChecklistItemTemplate[] }[];
};

/** Section for items the user adds themselves. */
export const CUSTOM_SECTION = "My items";
