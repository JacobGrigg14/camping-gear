import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Provider, Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useLists } from "./lists";
import { useTrips } from "./trips";

WebBrowser.maybeCompleteAuthSession();

type AuthState = {
  /** False until the stored session has been checked. */
  ready: boolean;
  session: Session | null;
  user: User | null;
};

export const useAuth = create<AuthState>()(() => ({ ready: !supabase, session: null, user: null }));

const siteUrl = process.env.EXPO_PUBLIC_SITE_URL?.replace(/\/$/, "");

if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    const previousUserId = useAuth.getState().user?.id;
    useAuth.setState({ ready: true, session, user: session?.user ?? null });
    const userId = session?.user.id;
    if (userId === previousUserId) return;
    // Defer: Supabase recommends not calling other Supabase methods inside this callback.
    setTimeout(() => {
      if (userId) {
        useLists.getState().load();
        useTrips.getState().load();
      } else {
        useLists.getState().clear();
        useTrips.getState().clear();
      }
    }, 0);
  });
  // Saved data used to live only on the device (before accounts). Remove the old copies.
  AsyncStorage.multiRemove(["basecamp-lists", "basecamp-trips"]).catch(() => {});
}

/** For actions that need an account: returns true if signed in, otherwise opens the sign-in screen. */
export function requireAuth(): boolean {
  if (useAuth.getState().user) return true;
  router.push("/sign-in");
  return false;
}

/** Throws with a readable message on failure. */
export async function signInWithEmail(email: string, password: string): Promise<void> {
  if (!supabase) throw new Error("Accounts aren't set up yet.");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Returns true if the user must confirm their email before signing in. */
export async function signUpWithEmail(email: string, password: string): Promise<boolean> {
  if (!supabase) throw new Error("Accounts aren't set up yet.");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // The confirmation link opens the website, which finishes sign-up; then sign in here.
    options: siteUrl ? { emailRedirectTo: `${siteUrl}/auth/callback` } : undefined,
  });
  if (error) throw error;
  return !data.session;
}

export async function sendPasswordReset(email: string): Promise<void> {
  if (!supabase) throw new Error("Accounts aren't set up yet.");
  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    siteUrl ? { redirectTo: `${siteUrl}/auth/callback?next=/auth/update-password` } : undefined,
  );
  if (error) throw error;
}

/**
 * Apple / Google sign-in through the system browser (works in Expo Go).
 * Returns false if the user closed the browser without finishing.
 */
export async function signInWithProvider(provider: Provider): Promise<boolean> {
  if (!supabase) throw new Error("Accounts aren't set up yet.");
  const redirectTo = Linking.createURL("auth/callback");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== "success") return false;

  const params = new URL(result.url).searchParams;
  const authError = params.get("error_description");
  if (authError) throw new Error(authError);
  const code = params.get("code");
  if (!code) throw new Error("Sign-in didn't complete. Please try again.");
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) throw exchangeError;
  return true;
}

export async function signOut(): Promise<void> {
  await supabase?.auth.signOut();
}

/** Permanently deletes the account and all saved lists and trips. */
export async function deleteAccount(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.rpc("delete_account");
  if (error) throw error;
  await supabase.auth.signOut();
}
