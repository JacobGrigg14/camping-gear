import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button } from "@/components/Button";
import { T } from "@/components/T";
import { TextField } from "@/components/TextField";
import { api } from "@/lib/api";
import { type Provider, sendPasswordReset, signInWithEmail, signInWithProvider, signUpWithEmail } from "@/store/auth";
import { colors, fonts, radius, space } from "@/theme";

type Mode = "sign-in" | "sign-up";

/** Modal shown whenever a signed-out user tries to save gear or start a trip. */
export default function SignInScreen() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const done = () => (router.canGoBack() ? router.back() : router.replace("/"));

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const submit = () =>
    run(async () => {
      if (mode === "sign-in") await signInWithEmail(email.trim(), password);
      else await signUpWithEmail(email.trim(), password);
      done();
    });

  const oauth = (provider: Provider) =>
    run(async () => {
      if (await signInWithProvider(provider)) done();
    });

  const forgot = () =>
    run(async () => {
      if (!email.trim()) throw new Error("Enter your email above first.");
      await sendPasswordReset(email.trim());
      setNotice("If an account exists for that email, a reset link is on its way.");
    });

  if (!api) {
    return (
      <View style={styles.container}>
        <T variant="h2">Accounts are coming soon</T>
        <T>Saving gear and trips needs EXPO_PUBLIC_API_URL in apps/mobile/.env.local. See the README.</T>
        <Button title="Keep browsing" onPress={done} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <T variant="h1">{mode === "sign-in" ? "Sign in" : "Create account"}</T>
        <T>Save gear to your lists and plan trip checklists. They sync with the website too.</T>

        <Pressable
          onPress={() => oauth("apple")}
          disabled={busy}
          style={[styles.oauth, styles.apple]}
          accessibilityRole="button"
        >
          <Ionicons name="logo-apple" size={20} color={colors.white} />
          <T style={[styles.oauthText, { color: colors.white }]}>Continue with Apple</T>
        </Pressable>
        <Pressable
          onPress={() => oauth("google")}
          disabled={busy}
          style={[styles.oauth, styles.google]}
          accessibilityRole="button"
        >
          <Ionicons name="logo-google" size={18} color={colors.bark900} />
          <T style={styles.oauthText}>Continue with Google</T>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.rule} />
          <T variant="caption">OR</T>
          <View style={styles.rule} />
        </View>

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          textContentType={mode === "sign-in" ? "password" : "newPassword"}
          onSubmitEditing={submit}
        />
        {mode === "sign-in" && (
          <Pressable onPress={forgot} hitSlop={6} style={{ alignSelf: "flex-end" }}>
            <T style={styles.link}>Forgot password?</T>
          </Pressable>
        )}

        {error ? <T style={styles.error}>{error}</T> : null}
        {notice ? <T style={styles.notice}>{notice}</T> : null}

        <Button
          title={busy ? "One moment…" : mode === "sign-in" ? "Sign in" : "Create account"}
          onPress={submit}
          disabled={busy || !email.trim() || password.length < (mode === "sign-up" ? 8 : 1)}
        />
        <Pressable
          onPress={() => {
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            setError("");
          }}
          style={{ alignSelf: "center" }}
          hitSlop={6}
        >
          <T>
            {mode === "sign-in" ? "New here? " : "Already have an account? "}
            <T style={styles.link}>{mode === "sign-in" ? "Create an account" : "Sign in"}</T>
          </T>
        </Pressable>
        {mode === "sign-up" && <T variant="caption">Passwords need at least 8 characters.</T>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: space.xl, gap: space.lg, paddingBottom: space.xxl },
  oauth: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    borderRadius: radius.sm,
    paddingVertical: 13,
  },
  apple: { backgroundColor: "#000" },
  google: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.canvas300 },
  oauthText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.bark900 },
  divider: { flexDirection: "row", alignItems: "center", gap: space.md },
  rule: { flex: 1, height: 1, backgroundColor: colors.canvas200 },
  link: { fontFamily: fonts.semibold, color: colors.forest700 },
  error: { color: "#a23b2a", fontFamily: fonts.medium },
  notice: {
    color: colors.forest800,
    backgroundColor: colors.forest50,
    padding: space.md,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
});
