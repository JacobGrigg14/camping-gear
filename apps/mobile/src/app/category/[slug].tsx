import { getCategory, getProductsByCategory, type Product } from "@basecamp/shared";
import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { Chip } from "@/components/Chip";
import { DisclosureNote } from "@/components/DisclosureNote";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { T } from "@/components/T";
import { colors, space } from "@/theme";

type Sort = "rating" | "price-asc" | "price-desc";

const sorts: { value: Sort; label: string }[] = [
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
];

function sortProducts(list: Product[], sort: Sort): Product[] {
  return [...list].sort((a, b) => {
    if (sort === "price-asc") return a.priceTier.length - b.priceTier.length || b.rating - a.rating;
    if (sort === "price-desc") return b.priceTier.length - a.priceTier.length || b.rating - a.rating;
    return b.rating - a.rating;
  });
}

export default function CategoryScreen() {
  const { slug, subcategory: initialSub } = useLocalSearchParams<{ slug: string; subcategory?: string }>();
  const category = getCategory(slug);
  const [subcategory, setSubcategory] = useState(initialSub ?? "");
  const [sort, setSort] = useState<Sort>("rating");

  const products = useMemo(() => {
    const all = getProductsByCategory(slug);
    return sortProducts(subcategory ? all.filter((p) => p.subcategory === subcategory) : all, sort);
  }, [slug, subcategory, sort]);

  if (!category) {
    return <EmptyState icon="alert-circle-outline" title="Category not found" message="This category doesn't exist." />;
  }

  return (
    <>
      <Stack.Screen options={{ title: category.name }} />
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: space.lg }}>
            <ProductCard product={item} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: space.xxl, gap: space.lg }}
        ListHeaderComponent={
          <View style={styles.header}>
            <T>{category.description}</T>
            <DisclosureNote />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {[{ slug: "", name: "All" }, ...category.subcategories].map((s) => (
                <Chip
                  key={s.slug}
                  label={s.name}
                  active={subcategory === s.slug}
                  onPress={() => setSubcategory(s.slug)}
                />
              ))}
            </ScrollView>
            <View style={styles.sortRow}>
              <T variant="caption">
                {products.length} {products.length === 1 ? "product" : "products"}
              </T>
              <View style={{ flexDirection: "row", gap: space.xs }}>
                {sorts.map((s) => (
                  <Chip key={s.value} label={s.label} active={sort === s.value} onPress={() => setSort(s.value)} />
                ))}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ paddingHorizontal: space.lg }}>
            <EmptyState icon="funnel-outline" title="Nothing here yet" message="No gear matches that filter." />
          </View>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: space.md,
    padding: space.lg,
    backgroundColor: colors.canvas100,
    borderBottomWidth: 1,
    borderBottomColor: colors.canvas200,
  },
  chips: { gap: space.sm },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: space.sm,
  },
});
