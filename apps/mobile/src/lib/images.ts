import type { ImageSource } from "expo-image";
import { apiUrl } from "./api";

// Bundled filler images, keyed by the paths used in the catalog data.
// Regenerate with `npm run placeholders` from the repo root.
const placeholders: Record<string, number> = {
  "/placeholders/tents.svg": require("@/assets/placeholders/tents.svg"),
  "/placeholders/tents-2.svg": require("@/assets/placeholders/tents-2.svg"),
  "/placeholders/tents-3.svg": require("@/assets/placeholders/tents-3.svg"),
  "/placeholders/hammocks.svg": require("@/assets/placeholders/hammocks.svg"),
  "/placeholders/hammocks-2.svg": require("@/assets/placeholders/hammocks-2.svg"),
  "/placeholders/hammocks-3.svg": require("@/assets/placeholders/hammocks-3.svg"),
  "/placeholders/sleeping-bags.svg": require("@/assets/placeholders/sleeping-bags.svg"),
  "/placeholders/sleeping-bags-2.svg": require("@/assets/placeholders/sleeping-bags-2.svg"),
  "/placeholders/sleeping-bags-3.svg": require("@/assets/placeholders/sleeping-bags-3.svg"),
  "/placeholders/sleeping-pads.svg": require("@/assets/placeholders/sleeping-pads.svg"),
  "/placeholders/sleeping-pads-2.svg": require("@/assets/placeholders/sleeping-pads-2.svg"),
  "/placeholders/sleeping-pads-3.svg": require("@/assets/placeholders/sleeping-pads-3.svg"),
  "/placeholders/backpacks.svg": require("@/assets/placeholders/backpacks.svg"),
  "/placeholders/backpacks-2.svg": require("@/assets/placeholders/backpacks-2.svg"),
  "/placeholders/backpacks-3.svg": require("@/assets/placeholders/backpacks-3.svg"),
  "/placeholders/jackets.svg": require("@/assets/placeholders/jackets.svg"),
  "/placeholders/jackets-2.svg": require("@/assets/placeholders/jackets-2.svg"),
  "/placeholders/jackets-3.svg": require("@/assets/placeholders/jackets-3.svg"),
  "/placeholders/boots.svg": require("@/assets/placeholders/boots.svg"),
  "/placeholders/boots-2.svg": require("@/assets/placeholders/boots-2.svg"),
  "/placeholders/boots-3.svg": require("@/assets/placeholders/boots-3.svg"),
  "/placeholders/headlamps.svg": require("@/assets/placeholders/headlamps.svg"),
  "/placeholders/headlamps-2.svg": require("@/assets/placeholders/headlamps-2.svg"),
  "/placeholders/headlamps-3.svg": require("@/assets/placeholders/headlamps-3.svg"),
  "/placeholders/lanterns.svg": require("@/assets/placeholders/lanterns.svg"),
  "/placeholders/lanterns-2.svg": require("@/assets/placeholders/lanterns-2.svg"),
  "/placeholders/lanterns-3.svg": require("@/assets/placeholders/lanterns-3.svg"),
  "/placeholders/knives.svg": require("@/assets/placeholders/knives.svg"),
  "/placeholders/knives-2.svg": require("@/assets/placeholders/knives-2.svg"),
  "/placeholders/knives-3.svg": require("@/assets/placeholders/knives-3.svg"),
  "/placeholders/chairs.svg": require("@/assets/placeholders/chairs.svg"),
  "/placeholders/chairs-2.svg": require("@/assets/placeholders/chairs-2.svg"),
  "/placeholders/chairs-3.svg": require("@/assets/placeholders/chairs-3.svg"),
  "/placeholders/tables.svg": require("@/assets/placeholders/tables.svg"),
  "/placeholders/tables-2.svg": require("@/assets/placeholders/tables-2.svg"),
  "/placeholders/tables-3.svg": require("@/assets/placeholders/tables-3.svg"),
};

/**
 * Resolves an image path from the catalog: bundled placeholders, a full URL, or a path on the
 * website (e.g. an image uploaded in the admin).
 */
export function imageSource(path: string): ImageSource | number {
  return placeholders[path] ?? { uri: path.startsWith("/") ? `${apiUrl}${path}` : path };
}
