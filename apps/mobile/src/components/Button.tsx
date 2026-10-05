import { Pressable, StyleSheet, type PressableProps } from "react-native";
import { colors, fonts, radius } from "@/theme";
import { T } from "./T";

type Kind = "primary" | "secondary" | "danger";

export function Button({ title, kind = "primary", style, ...props }: PressableProps & { title: string; kind?: Kind }) {
  return (
    <Pressable
      accessibilityRole="button"
      style={(state) => [
        styles.base,
        styles[kind],
        state.pressed && { opacity: 0.8 },
        props.disabled && { opacity: 0.4 },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <T style={[styles.text, kind !== "primary" && { color: kind === "danger" ? "#a23b2a" : colors.forest800 }]}>
        {title}
      </T>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 18, alignItems: "center" },
  primary: { backgroundColor: colors.ember500 },
  secondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.canvas300 },
  danger: { backgroundColor: "transparent" },
  text: { color: colors.white, fontFamily: fonts.semibold, fontSize: 15 },
});
