import type { ChecklistTemplate } from "../checklists";
import type { Category, CategorySlug, Product } from "../types";

// Response shapes of the Laravel JSON API (apps/web/app/Http/Resources).

export type Catalog = {
  categories: Category[];
  products: Product[];
  checklistTemplates: ChecklistTemplate[];
};

export type User = {
  id: number;
  name: string;
  email: string;
  /** "email", "google" or "apple" */
  signInMethod: string;
};

export type AuthResult = { token: string; user: User };

export type GearList = {
  id: string;
  name: string;
  isFavorites: boolean;
  /** Most recently saved first. */
  productIds: string[];
  createdAt: string;
};

export type TripItem = {
  id: string;
  label: string;
  section: string;
  checked: boolean;
  /** A recommended product... */
  productSlug: string | null;
  /** ...or a type of gear to browse. */
  gear: { category: CategorySlug; subcategory: string } | null;
};

export type Trip = {
  id: string;
  name: string;
  templateId: string | null;
  createdAt: string;
  items: TripItem[];
};
