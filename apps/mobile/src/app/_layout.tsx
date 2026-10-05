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
import { useAuth } from "@/store/auth";
import { colors, headerOptions } from "@/theme";

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
  useEffect(() => {
    if ((loaded || error) && authReady) SplashScreen.hideAsync();
  }, [loaded, error, authReady]);

  // Wait for fonts and the stored session, so saved hearts don't flicker on launch.
  if ((!loaded && !error) || !authReady) return null;

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
