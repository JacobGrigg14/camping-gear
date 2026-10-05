import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { colors, radius, space } from "@/theme";
import { T } from "./T";

export function EmptyState({
  icon,
  title,
  message,
  children,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.box}>
      <Ionicons name={icon} size={40} color={colors.forest300} />
      <T variant="h3">{title}</T>
      <T variant="small" style={{ textAlign: "center" }}>
        {message}
      </T>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    gap: space.sm,
    padding: space.xxl,
    backgroundColor: colors.canvas100,
    borderRadius: radius.md,
  },
});
