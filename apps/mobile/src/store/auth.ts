import type { User } from "@basecamp/shared";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { create } from "zustand";
import { api, apiUrl, loadSession, saveSession, setUnauthorizedHandler, type Session } from "@/lib/api";
import { useLists } from "./lists";
import { useTrips } from "./trips";

WebBrowser.maybeCompleteAuthSession();

type AuthState = {
  /** False until the stored session has been checked. */
  ready: boolean;
  user: User | null;
};

export const useAuth = create<AuthState>()(() => ({ ready: false, user: null }));

export type Provider = "apple" | "google";

const deviceName = Constants.deviceName ?? `Basecamp app (${Platform.OS})`;

function notConfigured(): never {
  throw new Error("Accounts aren't set up yet.");
}

/** Signs in or out on this device and loads (or clears) the user's lists and trips. */
async function setSession(session: Session | null) {
  const previousUserId = useAuth.getState().user?.id;
  await saveSession(session);
  useAuth.setState({ ready: true, user: session?.user ?? null });
  if (session?.user.id === previousUserId) return;
  if (session) {
    useLists.getState().load();
    useTrips.getState().load();
  } else {
    useLists.getState().clear();
    useTrips.getState().clear();
  }
}

// The token was revoked elsewhere (signed out, account deleted): sign out here too.
setUnauthorizedHandler(() => {
  if (useAuth.getState().user) setSession(null);
});

async function start() {
  const session = api ? await loadSession() : null;
  // Signed in straight away from the saved session, so the app also opens offline.
  await setSession(session);
  if (session && api) {
    // Refresh the account details (a 401 signs out via the handler above).
    api
      .fetchMe()
      .then((user) => setSession({ ...session, user }))
      .catch(() => {});
  }
}
if (typeof window !== "undefined") start();
else useAuth.setState({ ready: true });

/** For actions that need an account: returns true if signed in, otherwise opens the sign-in screen. */
export function requireAuth(): boolean {
  if (useAuth.getState().user) return true;
  router.push("/sign-in");
  return false;
}

/** Throws with a readable message on failure. */
export async function signInWithEmail(email: string, password: string): Promise<void> {
  if (!api) notConfigured();
  await setSession(await api.login(email, password, deviceName));
}

export async function signUpWithEmail(email: string, password: string): Promise<void> {
  if (!api) notConfigured();
  await setSession(await api.register(email, password, deviceName));
}

/** Emails a link to the website, where the new password is chosen. */
export async function sendPasswordReset(email: string): Promise<void> {
  if (!api) notConfigured();
  await api.forgotPassword(email);
}

/**
 * Apple / Google sign-in through the system browser (works in Expo Go). The website does the
 * provider sign-in and sends the browser back to the app with a one-time code.
 * Returns false if the user closed the browser without finishing.
 */
export async function signInWithProvider(provider: Provider): Promise<boolean> {
  if (!api) notConfigured();
  const redirectTo = Linking.createURL("auth/callback");
  const url = `${apiUrl}/auth/${provider}/redirect?app_redirect=${encodeURIComponent(redirectTo)}`;

  const result = await WebBrowser.openAuthSessionAsync(url, redirectTo);
  if (result.type !== "success") return false;

  const params = new URL(result.url).searchParams;
  const authError = params.get("error_description");
  if (authError) throw new Error(authError);
  const code = params.get("code");
  if (!code) throw new Error("Sign-in didn't complete. Please try again.");
  await setSession(await api.exchangeCode(code, deviceName));
  return true;
}

export async function signOut(): Promise<void> {
  await api?.logout().catch(() => {});
  await setSession(null);
}

/** Permanently deletes the account and all saved lists and trips. */
export async function deleteAccount(): Promise<void> {
  if (!api) return;
  await api.deleteAccount();
  await setSession(null);
}
