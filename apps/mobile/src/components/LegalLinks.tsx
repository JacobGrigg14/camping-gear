import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { colors, fonts, space } from "@/theme";

const links = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

/** About, privacy and terms links, for the bottom of the home and account screens. */
export function LegalLinks() {
  return (
    <View style={styles.row}>
      {links.map((l) => (
        <Link key={l.href} href={l.href} style={styles.link}>
          {l.label}
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: space.xl },
  link: { fontFamily: fonts.semibold, fontSize: 13, color: colors.bark500, textDecorationLine: "underline" },
});
