import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet } from "react-native";
import { requireAuth } from "@/store/auth";
import { useFavoritesId, useIsInAnyList, useLists } from "@/store/lists";
import { colors } from "@/theme";

/** Heart toggle: tap saves to Favorites (or removes from it); long-press opens the list picker. Needs an account. */
export function SaveButton({
  productId,
  onLongPress,
  size = 22,
  floating,
}: {
  productId: string;
  onLongPress?: () => void;
  size?: number;
  floating?: boolean;
}) {
  const saved = useIsInAnyList(productId);
  const favoritesId = useFavoritesId();
  const toggle = useLists((s) => s.toggleProduct);
  return (
    <Pressable
      onPress={() => {
        if (requireAuth() && favoritesId) toggle(favoritesId, productId);
      }}
      onLongPress={onLongPress && (() => requireAuth() && onLongPress())}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={saved ? "Saved. Tap to toggle Favorites" : "Save to Favorites"}
      style={({ pressed }) => [floating && styles.floating, pressed && { opacity: 0.6 }]}
    >
      <Ionicons name={saved ? "heart" : "heart-outline"} size={size} color={saved ? colors.ember500 : colors.bark700} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floating: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(250,246,238,0.92)",
    borderRadius: 999,
    padding: 6,
  },
});
