import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { NamePrompt } from "@/components/NamePrompt";
import { T } from "@/components/T";
import { imageSource } from "@/lib/images";
import { useAuth } from "@/store/auth";
import { useCatalog } from "@/store/catalog";
import { useLists, type GearList } from "@/store/lists";
import { colors, radius, space } from "@/theme";

export default function MyGearScreen() {
  const user = useAuth((s) => s.user);
  const lists = useLists((s) => s.lists);
  const createList = useLists((s) => s.createList);
  const load = useLists((s) => s.load);
  const [naming, setNaming] = useState(false);

  // Pick up changes made on the website or another device.
  useFocusEffect(
    useCallback(() => {
      if (user) load();
    }, [user, load]),
  );

  if (!user) {
    return (
      <View style={{ padding: space.lg }}>
        <EmptyState
          icon="heart-outline"
          title="Save your favourite gear"
          message="Sign in to save products and build kits for different trips. Your lists sync with the website."
        >
          <Button title="Sign in" onPress={() => router.push("/sign-in")} style={{ marginTop: space.sm }} />
        </EmptyState>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={lists}
        keyExtractor={(l) => l.id}
        renderItem={({ item }) => <ListRow list={item} />}
        contentContainerStyle={{ padding: space.lg, gap: space.md }}
        ListHeaderComponent={
          <T variant="small" style={{ marginBottom: space.xs }}>
            Tap the heart on any product to save it to Favorites, or build kits for different kinds of trips.
          </T>
        }
        ListFooterComponent={
          <Button title="New list" onPress={() => setNaming(true)} style={{ marginTop: space.sm }} />
        }
      />
      <NamePrompt
        visible={naming}
        title="New list"
        placeholder="e.g. Winter backpacking kit"
        submitLabel="Create"
        onCancel={() => setNaming(false)}
        onSubmit={async (name) => {
          setNaming(false);
          const id = await createList(name);
          if (id) router.push(`/list/${id}`);
        }}
      />
    </>
  );
}

function ListRow({ list }: { list: GearList }) {
  const products = useCatalog((s) => s.products);
  const preview = list.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined)
    .slice(0, 3);
  return (
    <Link href={`/list/${list.id}`} asChild>
      <Pressable style={styles.row}>
        <View style={styles.icon}>
          <Ionicons
            name={list.isFavorites ? "heart" : "albums-outline"}
            size={22}
            color={list.isFavorites ? colors.ember500 : colors.forest700}
          />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <T variant="h3">{list.name}</T>
          <T variant="caption">
            {list.productIds.length} {list.productIds.length === 1 ? "item" : "items"}
          </T>
        </View>
        <View style={styles.thumbs}>
          {preview.map((p) => (
            <Image key={p.id} source={imageSource(p.images[0])} style={styles.thumb} />
          ))}
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.bark300} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.canvas200,
    padding: space.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.canvas100,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbs: { flexDirection: "row" },
  thumb: { width: 32, height: 32, borderRadius: 6, marginLeft: -8, borderWidth: 2, borderColor: colors.white },
});
