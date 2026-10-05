import { colors } from "@basecamp/shared";

export { colors };

export const fonts = {
  display: "Bitter_700Bold",
  displayHeavy: "Bitter_800ExtraBold",
  body: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 6, md: 10, lg: 14, pill: 999 };

export const headerOptions = {
  headerStyle: { backgroundColor: colors.forest800 },
  headerTintColor: colors.canvas50,
  headerTitleStyle: { fontFamily: fonts.display, fontSize: 18 },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.canvas50 },
};
