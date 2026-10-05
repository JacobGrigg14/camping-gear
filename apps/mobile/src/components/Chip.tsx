import { Pressable, StyleSheet } from "react-native";
import { colors, fonts, radius } from "@/theme";
import { T } from "./T";

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[styles.chip, active && styles.active]}
    >
      <T style={[styles.text, active && { color: colors.white }]}>{label}</T>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { backgroundColor: colors.canvas100, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7 },
  active: { backgroundColor: colors.forest700 },
  text: { fontFamily: fonts.medium, fontSize: 13, color: colors.bark900 },
});
