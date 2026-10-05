import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import type { ColorValue } from "react-native";
import { colors, fonts, headerOptions } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

function icon(name: IconName, focusedName: IconName) {
  return ({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) => (
    <Ionicons name={focused ? focusedName : name} color={color} size={size} />
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
