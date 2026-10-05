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

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

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
      </Stack>
    </ThemeProvider>
  );
}
