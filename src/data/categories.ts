import type { Category } from "@/types";

export const categories: Category[] = [
  {
    slug: "shelter-sleep",
    name: "Shelter & Sleep",
    tagline: "Tents, hammocks, bags and pads",
    description:
      "A good night's sleep makes or breaks a trip. These are our picks for tents, hammocks, sleeping bags and pads across every season and budget.",
    image: "/placeholders/tents.svg",
    subcategories: [
      { slug: "tents", name: "Tents" },
      { slug: "hammocks", name: "Hammocks" },
      { slug: "sleeping-bags", name: "Sleeping Bags" },
      { slug: "sleeping-pads", name: "Sleeping Pads" },
    ],
  },
  {
    slug: "packs-clothing",
    name: "Packs & Clothing",
    tagline: "Backpacks, jackets and boots",
    description:
      "Carry it comfortably and stay dry doing it. Backpacks, shells, insulation and footwear we'd trust on the trail.",
    image: "/placeholders/backpacks.svg",
    subcategories: [
      { slug: "backpacks", name: "Backpacks" },
      { slug: "jackets", name: "Jackets" },
      { slug: "boots", name: "Boots" },
    ],
  },
  {
    slug: "lighting-tools-furniture",
    name: "Lighting, Tools & Furniture",
    tagline: "Headlamps, lanterns, knives, chairs and tables",
    description:
      "The camp essentials: light after dark, a blade that holds an edge, and somewhere comfortable to sit by the fire.",
    image: "/placeholders/lanterns.svg",
    subcategories: [
      { slug: "headlamps", name: "Headlamps" },
      { slug: "lanterns", name: "Lanterns" },
      { slug: "knives", name: "Knives & Tools" },
      { slug: "chairs", name: "Chairs" },
      { slug: "tables", name: "Tables" },
    ],
  },
];
