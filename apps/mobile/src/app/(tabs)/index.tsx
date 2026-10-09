import Ionicons from "@expo/vector-icons/Ionicons";
import { amazonDisclosure, disclosureShort, getTopRated, type Product, site } from "@basecamp/shared";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useMemo } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { LegalLinks } from "@/components/LegalLinks";
import { ProductTile } from "@/components/ProductCard";
import { T } from "@/components/T";
import { imageSource } from "@/lib/images";
import { useCatalog } from "@/store/catalog";
import { colors, fonts, radius, space } from "@/theme";

export default function BrowseScreen() {
  const categories = useCatalog((s) => s.categories);
  const products = useCatalog((s) => s.products);
  const featured = useMemo(() => products.filter((p) => p.featured), [products]);
  const topRated = useMemo(() => getTopRated(products, 8), [products]);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: space.xxl }}>
      <View style={styles.hero}>
        <T style={styles.kicker}>{site.tagline}</T>
        <T variant="h1" style={{ color: colors.canvas50 }}>
          Gear up for your next night under the stars.
        </T>
        <T style={{ color: colors.canvas200 }}>{site.description}</T>
      </View>

      <Section title="Shop by category">
        <View style={{ gap: space.md, paddingHorizontal: space.lg }}>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} asChild>
              <Pressable style={styles.category}>
                <Image source={imageSource(c.image)} style={styles.categoryImage} contentFit="cover" />
                <View style={{ flex: 1, gap: 2 }}>
                  <T variant="h2">{c.name}</T>
                  <T variant="small">{c.tagline}</T>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.bark300} />
              </Pressable>
            </Link>
          ))}
        </View>
      </Section>

      <Section title="Featured gear">
        <Carousel products={featured} />
      </Section>

      <Section title="Top rated">
        <Carousel products={topRated} />
      </Section>

      <View style={styles.footer}>
        <T variant="caption" style={{ textAlign: "center" }}>
          {disclosureShort} {amazonDisclosure}
        </T>
        <LegalLinks />
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: space.xl }}>
      <T variant="h2" style={{ paddingHorizontal: space.lg, marginBottom: space.md }}>
        {title}
      </T>
      {children}
    </View>
  );
}

function Carousel({ products }: { products: Product[] }) {
  return (
    <FlatList
      horizontal
      data={products}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <ProductTile product={item} />}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: space.lg, gap: space.md }}
    />
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.forest900,
    padding: space.xl,
    paddingTop: space.xxl,
    gap: space.md,
    borderBottomWidth: 4,
    borderBottomColor: colors.bark700,
  },
  kicker: {
    color: colors.ember500,
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  category: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.canvas200,
    borderLeftWidth: 4,
    borderLeftColor: colors.bark700,
    padding: space.sm,
    paddingRight: space.md,
  },
  footer: { marginTop: space.xxl, paddingHorizontal: space.xl, gap: space.md },
  categoryImage: { width: 84, height: 84, borderRadius: radius.sm, backgroundColor: colors.canvas100 },
});
