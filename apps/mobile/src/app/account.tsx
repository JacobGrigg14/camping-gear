import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button } from "@/components/Button";
import { LegalLinks } from "@/components/LegalLinks";
import { T } from "@/components/T";
import { confirm, showError } from "@/lib/confirm";
import { deleteAccount, signOut, useAuth } from "@/store/auth";
import { colors, radius, space } from "@/theme";

export default function AccountScreen() {
  const user = useAuth((s) => s.user);

  const leave = () => (router.canGoBack() ? router.back() : router.replace("/"));

  if (!user) {
    return (
      <View style={styles.container}>
        <T>You're signed out.</T>
        <Button title="Sign in" onPress={() => router.replace("/sign-in")} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <T variant="label">Email</T>
        <T>{user.email}</T>
        <T variant="label" style={{ marginTop: space.md }}>
          Signed in with
        </T>
        <T style={{ textTransform: "capitalize" }}>{user.signInMethod}</T>
      </View>
      <T variant="small">Your lists and trips are saved to your account and also show up on the website.</T>
      <Button
        title="Sign out"
        kind="secondary"
        onPress={async () => {
          await signOut();
          leave();
        }}
      />
      <Button
        title="Delete account"
        kind="danger"
        onPress={() =>
          confirm(
            "Delete your account?",
            "Your saved lists and trips will be permanently removed. This can't be undone.",
            async () => {
              try {
                await deleteAccount();
                leave();
              } catch {
                showError("Couldn't delete your account. Try again.");
              }
            },
          )
        }
      />
      <LegalLinks />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: space.xl, gap: space.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.canvas200,
    padding: space.lg,
    gap: 2,
  },
});
