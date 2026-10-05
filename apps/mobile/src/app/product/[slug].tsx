import Ionicons from "@expo/vector-icons/Ionicons";
import { getProduct, getRelatedProducts, getSubcategoryName } from "@basecamp/shared";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { BuyButtons } from "@/components/BuyButtons";
import { EmptyState } from "@/components/EmptyState";
import { PriceTier } from "@/components/PriceTier";
import { ProductTile } from "@/components/ProductCard";
import { Rating } from "@/components/Rating";
import { SaveButton } from "@/components/SaveButton";
import { SaveToListSheet } from "@/components/SaveToListSheet";
import { T } from "@/components/T";
import { imageSource } from "@/lib/images";
import { requireAuth } from "@/store/auth";
import { colors, fonts, radius, space } from "@/theme";

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const product = getProduct(slug);
  const { width } = useWindowDimensions();
  const [imageIndex, setImageIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!product) {
    return (
      <EmptyState icon="alert-circle-outline" title="Product not found" message="This item may have been removed." />
    );
  }
  const related = getRelatedProducts(product, 6);

  return (
    <>
      <Stack.Screen
        options={{
          title: product.brand,
          headerRight: () => (
            <View style={{ paddingHorizontal: space.sm }}>
              <SaveButton productId={product.id} onLongPress={() => setSheetOpen(true)} size={24} />
            </View>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxl }}>
        <FlatList
          horizontal
          pagingEnabled
          data={product.images}
          keyExtractor={(src) => src}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item }) => (
            <Image source={imageSource(item)} style={{ width, aspectRatio: 4 / 3 }} contentFit="cover" />
          )}
        />
        <View style={styles.dots}>
          {product.images.map((src, i) => (
            <View key={src} style={[styles.dot, i === imageIndex && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.section}>
          <T variant="label">
            {product.brand} · {getSubcategoryName(product)}
          </T>
          <T variant="h1">{product.name}</T>
          <View style={styles.meta}>
            <Rating value={product.rating} size={15} />
            <PriceTier tier={product.priceTier} />
          </View>
          <T>{product.shortDescription}</T>
          <Pressable
            onPress={() => requireAuth() && setSheetOpen(true)}
            style={styles.saveRow}
            accessibilityRole="button"
          >
            <Ionicons name="bookmark-outline" size={18} color={colors.forest700} />
            <T style={styles.saveText}>Save to a list…</T>
          </Pressable>
        </View>

        <View style={[styles.card, { marginHorizontal: space.lg, marginTop: space.lg }]}>
          <BuyButtons product={product} />
        </View>

        <View style={styles.section}>
          <T variant="h2">Overview</T>
          <T>{product.description}</T>
        </View>

        <View style={[styles.section, { flexDirection: "row", gap: space.md }]}>
          <View style={[styles.proCon, { backgroundColor: colors.forest50, borderLeftColor: colors.forest500 }]}>
            <T variant="h3" style={{ color: colors.forest800 }}>
              Pros
            </T>
            {product.pros.map((p) => (
              <T key={p} variant="small">
                + {p}
              </T>
            ))}
          </View>
          <View style={[styles.proCon, { backgroundColor: colors.canvas100, borderLeftColor: colors.bark500 }]}>
            <T variant="h3" style={{ color: colors.bark700 }}>
              Cons
            </T>
            {product.cons.map((c) => (
              <T key={c} variant="small">
                − {c}
              </T>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <T variant="h2">Specs</T>
          <View style={[styles.card, { paddingVertical: space.xs }]}>
            {Object.entries(product.specs).map(([k, v], i) => (
              <View key={k} style={[styles.specRow, i > 0 && styles.specDivider]}>
                <T variant="small" style={{ color: colors.bark500 }}>
                  {k}
                </T>
                <T variant="small" style={{ fontFamily: fonts.semibold, color: colors.bark900 }}>
                  {v}
                </T>
              </View>
            ))}
          </View>
        </View>

        {related.length > 0 && (
          <View style={{ marginTop: space.xl }}>
            <T variant="h2" style={{ paddingHorizontal: space.lg, marginBottom: space.md }}>
              You might also like
            </T>
            <FlatList
              horizontal
              data={related}
              keyExtractor={(p) => p.id}
              renderItem={({ item }) => <ProductTile product={item} />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.md }}
            />
          </View>
        )}
      </ScrollView>
      <SaveToListSheet productId={product.id} visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: space.sm },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.canvas300 },
  dotActive: { backgroundColor: colors.ember500 },
  section: { paddingHorizontal: space.lg, marginTop: space.lg, gap: space.sm },
  meta: { flexDirection: "row", alignItems: "center", gap: space.lg },
  saveRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: space.xs },
  saveText: { fontFamily: fonts.semibold, color: colors.forest700 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.canvas200,
    padding: space.lg,
  },
  proCon: { flex: 1, padding: space.md, borderRadius: radius.sm, borderLeftWidth: 4, gap: 4 },
  specRow: { flexDirection: "row", justifyContent: "space-between", gap: space.md, paddingVertical: space.sm },
  specDivider: { borderTopWidth: 1, borderTopColor: colors.canvas200 },
});
