import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import type { BasecampClient, Database } from "@basecamp/shared";
import { AppState, Platform } from "react-native";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** False until the Supabase env vars are set; browsing works, saving asks to sign in. */
export const supabaseConfigured = Boolean(url && key);

// Expo's static web render runs in Node, where there's no storage or session to restore.
const isServerRender = Platform.OS === "web" && typeof window === "undefined";

export const supabase: BasecampClient | null =
  supabaseConfigured && !isServerRender
    ? createClient<Database>(url, key, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          flowType: "pkce",
          lock: processLock,
        },
      })
    : null;

// Only refresh tokens while the app is in the foreground (recommended for React Native).
if (supabase && Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
