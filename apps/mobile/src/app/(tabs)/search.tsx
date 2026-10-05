import Ionicons from "@expo/vector-icons/Ionicons";
import { getProducts, searchProducts } from "@basecamp/shared";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, TextInput, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { T } from "@/components/T";
import { colors, fonts, radius, space } from "@/theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const products = getProducts();
  const results = useMemo(() => searchProducts(products, query), [products, query]);
  const hasQuery = query.trim().length > 0;

  return (
    <FlatList
      data={results}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ padding: space.lg, gap: space.lg }}
      ListHeaderComponent={
        <View style={{ gap: space.sm }}>
          <View style={styles.inputWrap}>
            <Ionicons name="search" size={18} color={colors.bark500} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Try “tent”, “down”, or “headlamp”"
              placeholderTextColor={colors.bark300}
              autoCorrect={false}
              returnKeyType="search"
              clearButtonMode="while-editing"
              accessibilityLabel="Search gear"
              style={styles.input}
            />
          </View>
          {hasQuery && results.length > 0 && (
            <T variant="caption">
              {results.length} {results.length === 1 ? "result" : "results"}
            </T>
          )}
        </View>
      }
      ListEmptyComponent={
        hasQuery ? (
          <EmptyState icon="search-outline" title="No gear found" message={`Nothing matches “${query}”.`} />
        ) : (
          <T variant="small">Search {products.length} products by name, brand, or type.</T>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.canvas300,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
  },
  input: { flex: 1, paddingVertical: 12, fontFamily: fonts.body, fontSize: 16, color: colors.bark900 },
});
