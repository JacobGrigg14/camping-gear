# Basecamp Outfitters (working name)

Camping gear affiliate project: a Next.js website and an Expo (React Native) app that share one product catalog. See [PLAN.md](PLAN.md) for the full project plan.

## Repo layout (npm workspaces)

```
apps/web/          Next.js 16 + Tailwind website
apps/mobile/       Expo SDK 57 app (Expo Router)
packages/shared/   @basecamp/shared: product data, types, catalog/search helpers, checklist templates, brand colors
scripts/           generate-placeholders.mjs (filler images for both apps)
```

## Getting started

```bash
npm install            # from the repo root, installs every workspace

npm run dev:web        # website at http://localhost:3000
npm run dev:mobile     # Expo dev server; scan the QR code with Expo Go
npm run build:web      # production build of the website
npm run lint           # lint the website
npm run typecheck      # type-check every workspace
npm run format         # prettier
npm run placeholders   # regenerate filler images
```

### Running the app on your phone

1. Install **Expo Go** from the App Store or Google Play.
2. Run `npm run dev:mobile` and scan the QR code (iPhone: Camera app; Android: Expo Go).
3. Your phone and Mac need to be on the same Wi-Fi network.

You can also press `w` in the Expo terminal to open the app in a web browser.

## Where things live

- `packages/shared/src/data/products/*.ts`: product catalog (filler for now)
- `packages/shared/src/data/categories.ts`: categories and subcategories
- `packages/shared/src/catalog.ts`: data access used by both apps (swap this when moving to a CMS)
- `packages/shared/src/checklists.ts`: trip packing list templates
- `packages/shared/src/site.ts`: site name, tagline, disclosure text
- `apps/web/src/app/go/[slug]/[retailer]/route.ts`: outbound affiliate redirect
- `apps/mobile/src/store/`: saved lists and trips (stored on the device)

## Adding affiliate links

Find the product in `packages/shared/src/data/products/` and fill in the `url` for each retailer:

```ts
links: [{ retailer: "amazon", url: "https://www.amazon.com/dp/XXXX?tag=yourtag-20" }],
```

Buttons with an empty `url` show "coming soon" on both the website and the app.

## Environment variables

- `NEXT_PUBLIC_SITE_URL` (web): your real domain, used for the sitemap and canonical URLs.
- `EXPO_PUBLIC_SITE_URL` (mobile): once the website is deployed, app buy buttons route through `<site>/go/...` so click tracking lives in one place. Without it, they open the affiliate URL directly.
