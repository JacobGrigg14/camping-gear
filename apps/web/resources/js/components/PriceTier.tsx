import { type PriceTier as Tier, priceTierLabels } from "@basecamp/shared";

export function PriceTier({ tier }: { tier: Tier }) {
  return (
    <span className="text-sm" title={priceTierLabels[tier]}>
      <span className="font-bold text-forest-700">{tier}</span>
      <span className="text-canvas-300">{"$$$$".slice(tier.length)}</span>
      <span className="sr-only"> ({priceTierLabels[tier]})</span>
    </span>
  );
}
