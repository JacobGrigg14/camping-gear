// Generates filler product images for the website and the app.
// Run from the repo root with: npm run placeholders
import { mkdirSync, writeFileSync } from "node:fs";

const outDirs = ["apps/web/public/placeholders", "apps/mobile/assets/placeholders"];

const subcategories = {
  tents: "Tents",
  hammocks: "Hammocks",
  "sleeping-bags": "Sleeping Bags",
  "sleeping-pads": "Sleeping Pads",
  backpacks: "Backpacks",
  jackets: "Jackets",
  boots: "Boots",
  headlamps: "Headlamps",
  lanterns: "Lanterns",
  knives: "Knives & Tools",
  chairs: "Chairs",
  tables: "Tables",
};

const palettes = [
  { sky: "#d9c9a8", far: "#8a9a7b", near: "#3f5a3c", trees: "#2b3d29", text: "#2b3d29" },
  { sky: "#e6b98a", far: "#9c6b4a", near: "#5c3f2c", trees: "#3b2a1e", text: "#3b2a1e" },
  { sky: "#b8c6c0", far: "#6f8579", near: "#2f4a42", trees: "#1f322c", text: "#1f322c" },
];

function tree(x, base, h, color) {
  const w = h * 0.45;
  return `<polygon points="${x},${base - h} ${x - w / 2},${base} ${x + w / 2},${base}" fill="${color}"/>`;
}

function svg(label, p) {
  const trees = [60, 110, 150, 650, 700, 745].map((x, i) => tree(x, 600, 140 + ((i * 37) % 80), p.trees)).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="${p.sky}"/>
  <circle cx="600" cy="150" r="60" fill="#f4e6c8" opacity="0.8"/>
  <polygon points="0,420 180,220 320,360 470,180 640,380 800,260 800,600 0,600" fill="${p.far}"/>
  <polygon points="0,500 220,360 400,470 580,340 800,480 800,600 0,600" fill="${p.near}"/>
  ${trees}
  <text x="400" y="300" text-anchor="middle" font-family="Georgia, serif" font-size="56" font-weight="700" fill="${p.text}">${label.replace("&", "&amp;")}</text>
  <text x="400" y="340" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" letter-spacing="4" fill="${p.text}" opacity="0.7">PLACEHOLDER IMAGE</text>
</svg>
`;
}

for (const dir of outDirs) mkdirSync(dir, { recursive: true });
for (const [slug, label] of Object.entries(subcategories)) {
  palettes.forEach((p, i) => {
    const name = i === 0 ? `${slug}.svg` : `${slug}-${i + 1}.svg`;
    for (const dir of outDirs) writeFileSync(`${dir}/${name}`, svg(label, p));
  });
}
console.log(`Wrote ${Object.keys(subcategories).length * palettes.length} placeholders`);
