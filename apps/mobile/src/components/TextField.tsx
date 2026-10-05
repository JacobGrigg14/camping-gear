import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { colors, fonts, radius, space } from "@/theme";
import { T } from "./T";

export function TextField({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: space.xs }}>
      <T variant="label">{label}</T>
      <TextInput placeholderTextColor={colors.bark300} style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
