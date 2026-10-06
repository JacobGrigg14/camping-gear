import { Bitter_700Bold, Bitter_800ExtraBold } from "@expo-google-fonts/bitter";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { Button } from "@/components/Button";
import { T } from "@/components/T";
import { useAuth } from "@/store/auth";
import { useCatalog } from "@/store/catalog";
import { colors, headerOptions, space } from "@/theme";

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.ember500,
    background: colors.canvas50,
    card: colors.forest800,
    text: colors.canvas50,
    border: colors.bark700,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Bitter_700Bold,
    Bitter_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const authReady = useAuth((s) => s.ready);
  const catalogStatus = useCatalog((s) => s.status);
  const ready = (loaded || error) && authReady && catalogStatus !== "loading";
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Wait for fonts, the stored session and the catalog (cached or fresh), so nothing flickers on launch.
  if (!ready) return null;
  if (catalogStatus === "error") return <CatalogError />;

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ ...headerOptions, headerBackButtonDisplayMode: "minimal" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="category/[slug]" options={{ title: "" }} />
        <Stack.Screen name="product/[slug]" options={{ title: "" }} />
        <Stack.Screen name="list/[id]" options={{ title: "" }} />
        <Stack.Screen name="trip/[id]" options={{ title: "" }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
        <Stack.Screen name="account" options={{ title: "Account" }} />
        <Stack.Screen name="sign-in" options={{ title: "", presentation: "modal" }} />
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

/** First launch with no connection (nothing cached yet), or the API URL isn't set. */
function CatalogError() {
  const message = useCatalog((s) => s.error);
  const load = useCatalog((s) => s.load);
  return (
    <View
      style={{ flex: 1, justifyContent: "center", padding: space.xl, gap: space.lg, backgroundColor: colors.canvas50 }}
    >
      <StatusBar style="dark" />
      <T variant="h2">Couldn&apos;t load the gear</T>
      <T>{message}</T>
      <Button title="Try again" onPress={load} />
    </View>
  );
}
