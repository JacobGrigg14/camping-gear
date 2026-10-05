import type { Retailer } from "./types";

export const retailers: Record<Retailer, { name: string }> = {
  amazon: { name: "Amazon" },
  "bass-pro": { name: "Bass Pro Shops" },
  cabelas: { name: "Cabela's" },
  rei: { name: "REI" },
  backcountry: { name: "Backcountry" },
};

export function isRetailer(value: string): value is Retailer {
  return value in retailers;
}
