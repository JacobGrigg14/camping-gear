import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SectionList, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { T } from "@/components/T";
import { confirm } from "@/lib/confirm";
import { useProduct } from "@/store/catalog";
import { useTrips, type TripItem } from "@/store/trips";
import { colors, fonts, radius, space } from "@/theme";

/** How long the "Removed … Undo" bar stays up. */
const UNDO_MS = 6000;

export default function TripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trip = useTrips((s) => s.trips.find((t) => t.id === id));
  const toggleItem = useTrips((s) => s.toggleItem);
  const addItem = useTrips((s) => s.addItem);
  const removeItem = useTrips((s) => s.removeItem);
  const restoreItem = useTrips((s) => s.restoreItem);
  const deleteTrip = useTrips((s) => s.deleteTrip);
  const [newItem, setNewItem] = useState("");
  /** The last removed item and where it was, while it can still be undone. */
  const [removed, setRemoved] = useState<{ item: TripItem; index: number } | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!removed) return;
    const timer = setTimeout(() => setRemoved(null), UNDO_MS);
    return () => clearTimeout(timer);
  }, [removed]);

  if (!trip) return null;

  const sectionTitles = [...new Set(trip.items.map((i) => i.section))];
  const sections = sectionTitles.map((title) => ({ title, data: trip.items.filter((i) => i.section === title) }));
  const done = trip.items.filter((i) => i.checked).length;

  const submitNew = () => {
    const label = newItem.trim();
    if (!label) return;
    addItem(trip.id, label);
    setNewItem("");
  };

  const remove = async (item: TripItem) => {
    const index = trip.items.findIndex((i) => i.id === item.id);
    setRemoved(null);
    if (await removeItem(trip.id, item.id)) setRemoved({ item, index });
  };

  const undoRemove = () => {
    if (!removed) return;
    setRemoved(null);
    restoreItem(trip.id, removed.item, removed.index);
  };

  return (
    <>
      <Stack.Screen options={{ title: trip.name }} />
      <SectionList
        sections={sections}
        keyExtractor={(i) => i.id}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: space.lg, paddingBottom: space.xxl }}
        ListHeaderComponent={
          <T variant="caption" style={{ marginBottom: space.sm }}>
            {done} of {trip.items.length} packed
          </T>
        }
        renderSectionHeader={({ section }) => (
          <T variant="label" style={styles.sectionTitle}>
            {section.title}
          </T>
        )}
        renderItem={({ item }) => (
          <ItemRow item={item} onToggle={() => toggleItem(trip.id, item.id)} onRemove={() => remove(item)} />
        )}
        ListFooterComponent={
          <View style={{ gap: space.md, marginTop: space.xl }}>
            <View style={styles.addRow}>
              <TextInput
                value={newItem}
                onChangeText={setNewItem}
                placeholder="Add your own item"
                placeholderTextColor={colors.bark300}
                onSubmitEditing={submitNew}
                returnKeyType="done"
                style={styles.input}
              />
              <Button title="Add" onPress={submitNew} disabled={!newItem.trim()} />
            </View>
            <Button
              title="Delete trip"
              kind="danger"
              onPress={() =>
                confirm("Delete trip?", `“${trip.name}” and its checklist will be removed.`, () => {
                  router.back();
                  deleteTrip(trip.id);
                })
              }
            />
          </View>
        }
      />
      {removed && (
        <View style={[styles.undoBar, { bottom: insets.bottom + space.lg }]} accessibilityLiveRegion="polite">
          <T style={styles.undoText} numberOfLines={1}>
            Removed “{removed.item.label}”
          </T>
          <Pressable onPress={undoRemove} hitSlop={8} accessibilityRole="button">
            <T style={styles.undoAction}>Undo</T>
          </Pressable>
        </View>
      )}
    </>
  );
}

function ItemRow({ item, onToggle, onRemove }: { item: TripItem; onToggle: () => void; onRemove: () => void }) {
  const product = useProduct(item.productSlug ?? undefined);
  const openPick = () => {
    if (product) router.push(`/product/${product.slug}`);
    else if (item.gear)
      router.push({
        pathname: "/category/[slug]",
        params: { slug: item.gear.category, subcategory: item.gear.subcategory },
      });
  };

  return (
    <View style={styles.item}>
      <Pressable
        onPress={onToggle}
        style={styles.check}
        hitSlop={6}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.checked }}
        accessibilityLabel={item.label}
      >
        <Ionicons
          name={item.checked ? "checkmark-circle" : "ellipse-outline"}
          size={26}
          color={item.checked ? colors.forest500 : colors.bark300}
        />
        <T style={[styles.itemLabel, item.checked && styles.checked]}>{item.label}</T>
      </Pressable>
      {(product || item.gear) && (
        <Pressable onPress={openPick} hitSlop={6} style={styles.pick} accessibilityRole="link">
          <T style={styles.pickText}>{product ? "Our pick" : "Browse"}</T>
          <Ionicons name="chevron-forward" size={14} color={colors.ember600} />
        </Pressable>
      )}
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={6} accessibilityLabel={`Remove ${item.label}`}>
          <Ionicons name="close" size={20} color={colors.bark300} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginTop: space.lg, marginBottom: space.sm },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    marginBottom: 6,
  },
  check: { flex: 1, flexDirection: "row", alignItems: "center", gap: space.md },
  itemLabel: { flex: 1, fontFamily: fonts.medium, color: colors.bark900 },
  checked: { color: colors.bark300, textDecorationLine: "line-through" },
  pick: { flexDirection: "row", alignItems: "center", gap: 2 },
  pickText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ember600 },
  addRow: { flexDirection: "row", gap: space.sm },
  undoBar: {
    position: "absolute",
    left: space.lg,
    right: space.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: colors.bark900,
    borderRadius: radius.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  undoText: { flex: 1, color: colors.white },
  undoAction: { fontFamily: fonts.semibold, color: colors.ember500 },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.canvas300,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.bark900,
  },
});
