import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, type ColorValue } from "react-native";
import { useAuth } from "@/store/auth";
import { colors, fonts, headerOptions } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

function icon(name: IconName, focusedName: IconName) {
  return ({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) => (
    <Ionicons name={focused ? focusedName : name} color={color} size={size} />
  );
}

/** Header button: account screen when signed in, otherwise sign in. */
function AccountButton() {
  const signedIn = useAuth((s) => s.user !== null);
  return (
    <Pressable
      onPress={() => router.push(signedIn ? "/account" : "/sign-in")}
      hitSlop={8}
      style={{ paddingHorizontal: 16 }}
      accessibilityRole="button"
      accessibilityLabel={signedIn ? "Account" : "Sign in"}
    >
      <Ionicons name={signedIn ? "person-circle" : "person-circle-outline"} size={26} color={colors.canvas50} />
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: headerOptions.headerStyle,
        headerTintColor: headerOptions.headerTintColor,
        headerTitleStyle: headerOptions.headerTitleStyle,
        headerShadowVisible: false,
        headerRight: () => <AccountButton />,
        sceneStyle: { backgroundColor: colors.canvas50 },
        tabBarActiveTintColor: colors.ember500,
        tabBarInactiveTintColor: colors.canvas300,
        tabBarStyle: { backgroundColor: colors.forest900, borderTopColor: colors.bark700 },
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Browse",
          headerTitle: "Basecamp Outfitters",
          tabBarIcon: icon("compass-outline", "compass"),
        }}
      />
      <Tabs.Screen name="search" options={{ title: "Search", tabBarIcon: icon("search-outline", "search") }} />
      <Tabs.Screen name="my-gear" options={{ title: "My Gear", tabBarIcon: icon("heart-outline", "heart") }} />
      <Tabs.Screen name="trips" options={{ title: "Trips", tabBarIcon: icon("map-outline", "map") }} />
    </Tabs>
  );
}
