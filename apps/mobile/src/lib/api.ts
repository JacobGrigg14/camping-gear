import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApiClient, type User } from "@basecamp/shared";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/** The Laravel site, e.g. https://basecampoutfitters.com (or http://<your-mac's-LAN-IP>:8000 in development). */
export const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

// Expo's static web render runs in Node, where there's no storage or session to restore.
const isServerRender = Platform.OS === "web" && typeof window === "undefined";

export type Session = { token: string; user: User };

const SESSION_KEY = "basecamp-session";
let session: Session | null = null;
let onUnauthorized: () => void = () => {};

/** Null until EXPO_PUBLIC_API_URL is set. */
export const api = apiUrl
  ? createApiClient({
      baseUrl: apiUrl,
      getToken: () => session?.token,
      onUnauthorized: () => onUnauthorized(),
    })
  : null;

/** Called when the server rejects the token (e.g. the account was deleted on the website). */
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

// The token lives in the iOS Keychain / Android Keystore. Expo web has no secure store, so it uses
// local storage there.
const storage = {
  get: () => (Platform.OS === "web" ? AsyncStorage.getItem(SESSION_KEY) : SecureStore.getItemAsync(SESSION_KEY)),
  set: (value: string) =>
    Platform.OS === "web" ? AsyncStorage.setItem(SESSION_KEY, value) : SecureStore.setItemAsync(SESSION_KEY, value),
  remove: () =>
    Platform.OS === "web" ? AsyncStorage.removeItem(SESSION_KEY) : SecureStore.deleteItemAsync(SESSION_KEY),
};

/** The session saved on this device, if any. */
export async function loadSession(): Promise<Session | null> {
  if (isServerRender) return null;
  try {
    const stored = await storage.get();
    session = stored ? (JSON.parse(stored) as Session) : null;
  } catch {
    session = null;
  }
  return session;
}

export async function saveSession(next: Session | null): Promise<void> {
  session = next;
  try {
    if (next) await storage.set(JSON.stringify(next));
    else await storage.remove();
  } catch {
    // Signed in for this launch only.
  }
}
