import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { colors, fonts, radius, space } from "@/theme";
import { Button } from "./Button";
import { T } from "./T";

/** Cross-platform text prompt (Alert.prompt is iOS-only). */
export function NamePrompt({
  visible,
  title,
  placeholder,
  initialValue = "",
  submitLabel = "Save",
  onSubmit,
  onCancel,
}: {
  visible: boolean;
  title: string;
  placeholder?: string;
  initialValue?: string;
  submitLabel?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const submit = () => {
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Cancel" />
        <View style={styles.card}>
          <T variant="h2">{title}</T>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor={colors.bark300}
            autoFocus
            onSubmitEditing={submit}
            returnKeyType="done"
            style={styles.input}
          />
          <View style={styles.actions}>
            <Button title="Cancel" kind="secondary" onPress={onCancel} style={{ flex: 1 }} />
            <Button title={submitLabel} onPress={submit} disabled={!value.trim()} style={{ flex: 1 }} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "center", padding: space.xl, backgroundColor: "rgba(31,46,32,0.55)" },
  card: { backgroundColor: colors.canvas50, borderRadius: radius.lg, padding: space.xl, gap: space.lg },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.canvas300,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.bark900,
  },
  actions: { flexDirection: "row", gap: space.md },
});
