import { StyleSheet, Text, type TextProps } from "react-native";
import { colors, fonts } from "@/theme";

type Variant = "h1" | "h2" | "h3" | "body" | "small" | "label" | "caption";

/** Themed text. */
export function T({ variant = "body", style, ...props }: TextProps & { variant?: Variant }) {
  return <Text style={[styles[variant], style]} {...props} />;
}

const styles = StyleSheet.create({
  h1: { fontFamily: fonts.displayHeavy, fontSize: 30, lineHeight: 36, color: colors.bark900 },
  h2: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28, color: colors.bark900 },
  h3: { fontFamily: fonts.display, fontSize: 17, lineHeight: 22, color: colors.bark900 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22, color: colors.bark700 },
  small: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.bark700 },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.bark500,
  },
  caption: { fontFamily: fonts.body, fontSize: 12, lineHeight: 16, color: colors.bark500 },
});
