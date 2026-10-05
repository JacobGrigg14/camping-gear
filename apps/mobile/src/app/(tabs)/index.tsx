import Ionicons from "@expo/vector-icons/Ionicons";
import { getCategories, getFeaturedProducts, getTopRated, site } from "@basecamp/shared";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ProductTile } from "@/components/ProductCard";
import { T } from "@/components/T";
import { imageSource } from "@/lib/images";
import { colors, fonts, radius, space } from "@/theme";

export default function BrowseScreen() {
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
          {getCategories().map((c) => (
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
        <Carousel products={getFeaturedProducts()} />
      </Section>

      <Section title="Top rated">
        <Carousel products={getTopRated(8)} />
      </Section>
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

function Carousel({ products }: { products: ReturnType<typeof getFeaturedProducts> }) {
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
  categoryImage: { width: 84, height: 84, borderRadius: radius.sm, backgroundColor: colors.canvas100 },
});
