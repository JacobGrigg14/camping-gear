import type { CategorySlug } from "./types";

export type ChecklistItemTemplate = {
  label: string;
  /** Recommend a specific product... */
  productSlug?: string;
  /** ...or a type of gear (category + subcategory) to browse. */
  gear?: { category: CategorySlug; subcategory: string };
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  description: string;
  sections: { title: string; items: ChecklistItemTemplate[] }[];
};

const tents = { category: "shelter-sleep", subcategory: "tents" } as const;
const sleepingBags = { category: "shelter-sleep", subcategory: "sleeping-bags" } as const;
const sleepingPads = { category: "shelter-sleep", subcategory: "sleeping-pads" } as const;
const backpacks = { category: "packs-clothing", subcategory: "backpacks" } as const;
const jackets = { category: "packs-clothing", subcategory: "jackets" } as const;
const boots = { category: "packs-clothing", subcategory: "boots" } as const;
const headlamps = { category: "lighting-tools-furniture", subcategory: "headlamps" } as const;
const lanterns = { category: "lighting-tools-furniture", subcategory: "lanterns" } as const;
const knives = { category: "lighting-tools-furniture", subcategory: "knives" } as const;
const chairs = { category: "lighting-tools-furniture", subcategory: "chairs" } as const;
const tables = { category: "lighting-tools-furniture", subcategory: "tables" } as const;

export const checklistTemplates: ChecklistTemplate[] = [
  {
    id: "car-camping",
    name: "Weekend car camping",
    description: "Everything for two nights at a drive-in campsite.",
    sections: [
      {
        title: "Shelter & sleep",
        items: [
          { label: "Family tent", productSlug: "timberwolf-6p-cabin-tent" },
          { label: "Sleeping bags", gear: sleepingBags },
          { label: "Sleeping pads", productSlug: "ridgeline-self-inflating-camp-mat" },
          { label: "Pillows" },
        ],
      },
      {
        title: "Camp setup",
        items: [
          { label: "Camp chairs", productSlug: "ridgeline-oversized-camp-chair" },
          { label: "Camp table", productSlug: "northfork-roll-top-camp-table" },
          { label: "Lantern", productSlug: "ember-glow-camp-lantern" },
          { label: "Headlamps", gear: headlamps },
          { label: "Multi-tool", productSlug: "cedar-stone-multi-tool" },
        ],
      },
      {
        title: "Kitchen & personal",
        items: [
          { label: "Stove and fuel" },
          { label: "Cooler and ice" },
          { label: "Water jugs" },
          { label: "Rain jacket", gear: jackets },
          { label: "First-aid kit" },
          { label: "Sunscreen and bug spray" },
        ],
      },
    ],
  },
  {
    id: "backpacking-overnight",
    name: "Backpacking overnight",
    description: "A light, dialed kit for one night on the trail.",
    sections: [
      {
        title: "Big three",
        items: [
          { label: "Backpack", productSlug: "summit-peak-55l-backpacking-pack" },
          { label: "Lightweight tent or hammock", gear: tents },
          { label: "Sleeping bag", productSlug: "summit-peak-20-down-sleeping-bag" },
          { label: "Sleeping pad", productSlug: "northfork-air-insulated-sleeping-pad" },
        ],
      },
      {
        title: "Essentials",
        items: [
          { label: "Headlamp", productSlug: "ember-400-rechargeable-headlamp" },
          { label: "Knife or multi-tool", gear: knives },
          { label: "Water filter" },
          { label: "Map and compass" },
          { label: "First-aid kit" },
          { label: "Fire starter" },
        ],
      },
      {
        title: "Clothing",
        items: [
          { label: "Rain shell", productSlug: "northfork-storm-shell-rain-jacket" },
          { label: "Puffy jacket", productSlug: "summit-peak-down-puffy" },
          { label: "Hiking boots or trail runners", gear: boots },
          { label: "Extra socks" },
        ],
      },
    ],
  },
  {
    id: "winter-camping",
    name: "Winter camping",
    description: "Stay warm and safe when temperatures drop below freezing.",
    sections: [
      {
        title: "Shelter & sleep",
        items: [
          { label: "4-season tent", productSlug: "northfork-4-season-dome" },
          { label: "Cold-rated sleeping bag", productSlug: "summit-peak-20-down-sleeping-bag" },
          { label: "Two sleeping pads (foam + inflatable)", gear: sleepingPads },
        ],
      },
      {
        title: "Clothing",
        items: [
          { label: "Insulated boots", productSlug: "timberwolf-insulated-winter-boot" },
          { label: "Down jacket", productSlug: "summit-peak-down-puffy" },
          { label: "Fleece midlayer", productSlug: "timberwolf-fleece-pullover" },
          { label: "Waterproof shell", gear: jackets },
          { label: "Warm hat and gloves" },
        ],
      },
      {
        title: "Gear",
        items: [
          { label: "Backpack", gear: backpacks },
          { label: "Headlamp + spare batteries", gear: headlamps },
          { label: "Lantern", gear: lanterns },
          { label: "Hatchet for firewood", productSlug: "cedar-stone-camp-hatchet" },
          { label: "Camp chair", gear: chairs },
          { label: "Table", gear: tables },
          { label: "Insulated water bottle" },
        ],
      },
    ],
  },
];

export function getChecklistTemplate(id: string): ChecklistTemplate | undefined {
  return checklistTemplates.find((t) => t.id === id);
}
