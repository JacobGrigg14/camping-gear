import type { Product } from "@basecamp/shared";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { imageSource } from "@/lib/images";
import { colors, radius, space } from "@/theme";
import { PriceTier } from "./PriceTier";
import { Rating } from "./Rating";
import { SaveButton } from "./SaveButton";
import { T } from "./T";

/** Full-width card used in category lists, search results and saved lists. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} asChild>
      <Pressable style={styles.card}>
        <View>
          <Image source={imageSource(product.images[0])} style={styles.image} contentFit="cover" />
          <SaveButton productId={product.id} floating />
        </View>
        <View style={styles.body}>
          <T variant="label">{product.brand}</T>
          <T variant="h3">{product.name}</T>
          <T variant="small" numberOfLines={2}>
            {product.shortDescription}
          </T>
          <View style={styles.footer}>
            <Rating value={product.rating} />
            <PriceTier tier={product.priceTier} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

/** Narrow card for horizontal carousels. */
export function ProductTile({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} asChild>
      <Pressable style={styles.tile}>
        <Image source={imageSource(product.images[0])} style={styles.tileImage} contentFit="cover" />
        <View style={styles.body}>
          <T variant="label">{product.brand}</T>
          <T variant="h3" numberOfLines={2} style={{ minHeight: 44 }}>
            {product.name}
          </T>
          <View style={styles.footer}>
            <Rating value={product.rating} size={12} />
            <PriceTier tier={product.priceTier} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const cardBase = {
  backgroundColor: colors.white,
  borderRadius: radius.md,
  borderWidth: 1,
  borderColor: colors.canvas200,
  overflow: "hidden",
} as const;

// Plain (non-array) styles: Link asChild on web rejects style arrays and functions.
const styles = StyleSheet.create({
  card: cardBase,
  image: { width: "100%", aspectRatio: 16 / 9, backgroundColor: colors.canvas100 },
  body: { padding: space.md, gap: 4 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: space.sm },
  tile: { ...cardBase, width: 220 },
  tileImage: { width: "100%", aspectRatio: 4 / 3, backgroundColor: colors.canvas100 },
});
