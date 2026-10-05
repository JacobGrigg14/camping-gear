import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLists } from "@/store/lists";
import { colors, fonts, radius, space } from "@/theme";
import { Button } from "./Button";
import { NamePrompt } from "./NamePrompt";
import { T } from "./T";

/** Bottom sheet for adding a product to any of the user's lists, or a new one. */
export function SaveToListSheet({
  productId,
  visible,
  onClose,
}: {
  productId: string;
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const lists = useLists((s) => s.lists);
  const toggle = useLists((s) => s.toggleProduct);
  const createList = useLists((s) => s.createList);
  const [naming, setNaming] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.lg }]}>
        <T variant="h2">Save to list</T>
        <ScrollView style={{ maxHeight: 320 }}>
          {lists.map((list) => {
            const inList = list.productIds.includes(productId);
            return (
              <Pressable
                key={list.id}
                onPress={() => toggle(list.id, productId)}
                style={styles.row}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: inList }}
              >
                <Ionicons
                  name={inList ? "checkbox" : "square-outline"}
                  size={22}
                  color={inList ? colors.forest700 : colors.bark300}
                />
                <T style={styles.rowText}>{list.name}</T>
                <T variant="caption">{list.productIds.length}</T>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.actions}>
          <Button title="New list" kind="secondary" onPress={() => setNaming(true)} style={{ flex: 1 }} />
          <Button title="Done" onPress={onClose} style={{ flex: 1 }} />
        </View>
      </View>
      <NamePrompt
        visible={naming}
        title="New list"
        placeholder="e.g. Winter backpacking kit"
        submitLabel="Create"
        onCancel={() => setNaming(false)}
        onSubmit={(name) => {
          createList(name, productId);
          setNaming(false);
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(31,46,32,0.45)" },
  sheet: {
    backgroundColor: colors.canvas50,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: space.xl,
    gap: space.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.canvas200,
  },
  rowText: { flex: 1, fontFamily: fonts.medium, color: colors.bark900 },
  actions: { flexDirection: "row", gap: space.md, marginTop: space.sm },
});
