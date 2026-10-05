import { retailers, type Product } from "@basecamp/shared";
import * as Linking from "expo-linking";
import { Pressable, StyleSheet, View } from "react-native";
import { buyUrl } from "@/lib/links";
import { colors, fonts, radius, space } from "@/theme";
import { DisclosureNote } from "./DisclosureNote";
import { T } from "./T";

export function BuyButtons({ product }: { product: Product }) {
  return (
    <View style={{ gap: space.sm }}>
      {product.links.map(({ retailer }) => {
        const url = buyUrl(product, retailer);
        const name = retailers[retailer].name;
        return url ? (
          <Pressable
            key={retailer}
            accessibilityRole="link"
            onPress={() => Linking.openURL(url)}
            style={({ pressed }) => [styles.button, pressed && { backgroundColor: colors.ember600 }]}
          >
            <T style={styles.buttonText}>Check price at {name}</T>
          </Pressable>
        ) : (
          <View key={retailer} style={styles.pending} accessibilityState={{ disabled: true }}>
            <T style={styles.pendingText}>{name}: coming soon</T>
          </View>
        );
      })}
      <DisclosureNote />
    </View>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: colors.ember500, borderRadius: radius.sm, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: colors.white, fontFamily: fonts.semibold, fontSize: 15 },
  pending: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.bark300,
    borderRadius: radius.sm,
    paddingVertical: 13,
    alignItems: "center",
  },
  pendingText: { color: colors.bark500, fontFamily: fonts.semibold, fontSize: 15 },
});
