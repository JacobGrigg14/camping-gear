import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import { colors, fonts } from "@/theme";
import { T } from "./T";

export function Rating({ value, size = 13 }: { value: number; size?: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          size={size}
          color={n - 0.75 <= value ? colors.ember500 : colors.canvas300}
          name={n - 0.25 <= value ? "star" : n - 0.75 <= value ? "star-half" : "star-outline"}
        />
      ))}
      <T style={[styles.value, { fontSize: size }]}>{value.toFixed(1)}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 1 },
  value: { marginLeft: 4, fontFamily: fonts.semibold, color: colors.bark900 },
});
