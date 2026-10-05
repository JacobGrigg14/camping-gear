import { getProductById } from "@basecamp/shared";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { NamePrompt } from "@/components/NamePrompt";
import { ProductCard } from "@/components/ProductCard";
import { confirm } from "@/lib/confirm";
import { useLists } from "@/store/lists";
import { space } from "@/theme";

export default function ListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const list = useLists((s) => s.lists.find((l) => l.id === id));
  const renameList = useLists((s) => s.renameList);
  const deleteList = useLists((s) => s.deleteList);
  const [renaming, setRenaming] = useState(false);

  if (!list) {
    return <EmptyState icon="albums-outline" title="List not found" message="This list may have been deleted." />;
  }
  const products = list.productIds.map(getProductById).filter((p) => p !== undefined);
  const editable = !list.isFavorites;

  return (
    <>
      <Stack.Screen options={{ title: list.name }} />
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={{ padding: space.lg, gap: space.lg }}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="Nothing saved yet"
            message="Tap the heart on a product, or long-press it to pick a list."
          >
            <Button title="Browse gear" onPress={() => router.navigate("/")} style={{ marginTop: space.sm }} />
          </EmptyState>
        }
        ListFooterComponent={
          editable ? (
            <View style={styles.actions}>
              <Button title="Rename list" kind="secondary" onPress={() => setRenaming(true)} />
              <Button
                title="Delete list"
                kind="danger"
                onPress={() =>
                  confirm(
                    "Delete list?",
                    `“${list.name}” will be removed. Saved products stay in your other lists.`,
                    () => {
                      router.back();
                      deleteList(list.id);
                    },
                  )
                }
              />
            </View>
          ) : null
        }
      />
      <NamePrompt
        visible={renaming}
        title="Rename list"
        initialValue={list.name}
        onCancel={() => setRenaming(false)}
        onSubmit={(name) => {
          renameList(list.id, name);
          setRenaming(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  actions: { gap: space.sm, marginTop: space.md },
});
