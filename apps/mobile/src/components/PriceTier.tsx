import { priceTierLabels, type PriceTier as Tier } from "@basecamp/shared";
import { Text } from "react-native";
import { colors, fonts } from "@/theme";

export function PriceTier({ tier }: { tier: Tier }) {
  return (
    <Text accessibilityLabel={`Price: ${priceTierLabels[tier]}`} style={{ fontFamily: fonts.bold, fontSize: 14 }}>
      <Text style={{ color: colors.forest700 }}>{tier}</Text>
      <Text style={{ color: colors.canvas300 }}>{"$$$$".slice(tier.length)}</Text>
    </Text>
  );
}
