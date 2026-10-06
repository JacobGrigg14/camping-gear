import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Catalog, Category, ChecklistTemplate, Product } from "@basecamp/shared";
import { create } from "zustand";
import { api } from "@/lib/api";

const CACHE_KEY = "basecamp-catalog";

type CatalogState = Catalog & {
  /** "loading" only until the first copy (cached or fresh) arrives. */
  status: "loading" | "ready" | "error";
  error: string;
  load: () => Promise<void>;
};

/**
 * Products, categories and trip templates from the website's API. The last copy is kept on the
 * device, so browsing starts instantly and works offline; a fresh copy loads on every launch.
 */
export const useCatalog = create<CatalogState>()((set, get) => ({
  categories: [],
  products: [],
  checklistTemplates: [],
  status: "loading",
  error: "",
  load: async () => {
    if (!api) {
      set({
        status: "error",
        error: "The app isn't connected to the website yet. Set EXPO_PUBLIC_API_URL (see the README).",
      });
      return;
    }
    if (get().status === "error") set({ status: "loading" });
    try {
      const catalog = await api.fetchCatalog();
      set({ ...catalog, status: "ready", error: "" });
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(catalog)).catch(() => {});
    } catch (e) {
      if (get().status !== "ready") {
        set({ status: "error", error: e instanceof Error ? e.message : "Couldn't load the gear catalog." });
      }
    }
  },
}));

async function start() {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached && useCatalog.getState().status === "loading") {
      useCatalog.setState({ ...(JSON.parse(cached) as Catalog), status: "ready" });
    }
  } catch {
    // No usable cache; wait for the network.
  }
  await useCatalog.getState().load();
}
if (typeof window !== "undefined") start();

export function useCategory(slug: string | undefined): Category | undefined {
  return useCatalog((s) => s.categories.find((c) => c.slug === slug));
}

export function useProduct(slug: string | undefined): Product | undefined {
  return useCatalog((s) => s.products.find((p) => p.slug === slug));
}

export function useChecklistTemplates(): ChecklistTemplate[] {
  return useCatalog((s) => s.checklistTemplates);
}
