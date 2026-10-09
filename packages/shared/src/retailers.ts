import type { Retailer } from "./types";

export const retailers: Record<Retailer, { name: string }> = {
  amazon: { name: "Amazon" },
  mec: { name: "MEC" },
  "bass-pro": { name: "Bass Pro Shops" },
  rei: { name: "REI" },
};

export function isRetailer(value: string): value is Retailer {
  return value in retailers;
}
