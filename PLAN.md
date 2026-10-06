# Camping Gear Affiliate Site + App — Project Plan

## Context

The repo is empty (just a README). We're building a camping gear affiliate business: **website first, mobile app second**. The site lists camping gear. Each item has buy buttons that link out to retailers (Amazon, Bass Pro Shops, Cabela's, etc.) through affiliate links, and we earn a commission on each sale. At launch every product uses placeholder images and placeholder info, and the real affiliate links get pasted in later.

**Decisions so far:**

- **Stack:** Laravel + Inertia + React (TypeScript) for the site and API, Expo (React Native) for the app. The site moved off Next.js and Supabase in October 2026.
- **Product data:** in the database, edited in a Filament admin (it started as TS data files)
- **App features:** everything the site does, plus saved gear lists, trip checklists, and price-drop alerts
- **Name:** a placeholder for now. Working name **"Basecamp Outfitters"**, kept in one config file so it's easy to swap.
- **Launch categories:** Shelter & Sleep, Packs & Clothing, Lighting/Tools/Furniture
- **Look:** rugged and outdoorsy, with earthy greens and browns and a textured feel (think Bass Pro or Cabela's)

---

## 1. Tech stack

| Layer                  | Choice                                                                                                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Layer                  | Choice                                                                                                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Website                | **Laravel 13 + Inertia 3 + React + TypeScript**, server-side rendered for SEO                                                                                                                                  |
| Styling                | **Tailwind CSS 4**, with a custom earthy theme: forest green, bark brown, canvas tan, ember orange for buttons. Headings in "Bitter", body text in "Inter".                                                    |
| Product data           | **PostgreSQL** tables (products, links, categories, trip templates), seeded from the original data and edited in a **Filament** admin at `/admin`                                                              |
| Accounts and user data | **Laravel**: Fortify (website sign-in), Sanctum (app tokens and the website's API calls), Socialite (Apple, Google). Saved lists and trips in Postgres, with ownership enforced by policies.                   |
| API                    | JSON API at `/api/v1`, used by the app and by the website's interactive bits. The typed client lives in `packages/shared`.                                                                                     |
| Hosting                | **Laravel Cloud or Forge** for the site, API and SSR server. Expo EAS for app builds and store submission.                                                                                                     |
| Mobile                 | **Expo (React Native) + Expo Router**, sharing types and the API client with the site through a monorepo                                                                                                       |

## 2. Repo structure

Phase 1 is a single Next.js app at the repo root:

```
src/
  app/                    # routes
    page.tsx              # home
    gear/[category]/page.tsx
    gear/[category]/[slug]/page.tsx
    search/page.tsx
    go/[slug]/[retailer]/route.ts   # affiliate redirect
    about/, disclosure/
  components/             # ProductCard, ProductGrid, BuyButtons, DisclosureBanner, Header, Footer, Filters...
  data/                   # categories.ts, products/*.ts (filler)
  lib/products.ts         # getProducts(), getProduct(), getByCategory(), search() — the ONLY way pages read data
  lib/site.ts             # site name, colors, nav
  types/                  # Product, Category, Retailer
public/placeholders/      # filler images
```

In the app phase this became a monorepo (`apps/web`, `apps/mobile`, `packages/shared`) using npm workspaces. Since the Laravel move, `apps/web` is the Laravel app, and `packages/shared` holds the TS types, brand colors and the API client. The README has the current layout.

## 3. Data model

```ts
type Retailer = "amazon" | "bass-pro" | "cabelas" | "rei" | "backcountry";
type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: "shelter-sleep" | "packs-clothing" | "lighting-tools-furniture";
  subcategory: string; // tents, sleeping-bags, backpacks, headlamps, chairs...
  shortDescription: string;
  description: string;
  images: string[];
  priceTier: "$" | "$$" | "$$$" | "$$$$"; // no hard prices (Amazon rules); real prices later via APIs
  rating: number; // our editorial rating
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  links: { retailer: Retailer; url: string }[]; // url = "" until real affiliate links arrive
  featured?: boolean;
  tags: string[];
};
```

Filler content: **about 8–10 products per category (about 30 total)**, with placeholder images (one consistent set of generated SVG or solid-color placeholders per subcategory).

## 4. Website pages

- **Home:** hero, featured gear, the 3 category tiles, and "Top picks" rows
- **Category** `/gear/[category]`: product grid, filters for subcategory, brand, price tier, and rating, plus sorting
- **Product** `/gear/[category]/[slug]`: gallery, rating, description, specs table, pros and cons, a buy button for each retailer, and related products
- **Search** `/search`: client-side search across name, brand, tags, and description
- **About** and **Affiliate Disclosure**
- Shared layout: header with category nav and search, footer with the disclosure note and links

## 5. Affiliate link system

- Buy buttons never link straight to the retailer. They go to `/go/[slug]/[retailer]`, which looks up the URL and sends a 302 redirect.
  - When real affiliate links arrive, you edit one field per product.
  - Clicks can be counted later (a clicks table written by the `/go` controller).
  - If a link is still empty, the button shows "Coming soon" and is disabled.
- All outbound links get `rel="sponsored nofollow noopener"` and open in a new tab.
- **Compliance:**
  - A short disclosure line sits near the buy buttons on every page, and there's a full `/disclosure` page. The FTC requires this.
  - Amazon Associates has its own required wording.
  - No hard-coded Amazon prices.
- Affiliate programs to apply for later: Amazon Associates, Bass Pro/Cabela's (they're one company), REI, Backcountry. These run directly or through networks like AvantLink, CJ, or Impact.

## 6. Mobile app (later phase)

- Expo app with the same browse, search, and product screens, reading the shared data layer
- **Accounts:** Laravel (Fortify / Sanctum / Socialite): email, Apple, Google
- **Saved gear lists:** favorite products and named kits (e.g. "Winter backpacking kit"), synced across devices. The website can get these too.
- **Trip checklists:** packing-list templates by trip type. Each checklist item can link to a recommended product.
- **Price-drop alerts:** need real price data:
  - Amazon Product Advertising API, which only unlocks after the Associates account makes qualifying sales
  - Affiliate network product feeds for the other retailers
  - A scheduled Laravel command (`routes/console.php` schedule) stores price history and sends push notifications through Expo Notifications
  - **This is the last feature built**, because it depends on approved affiliate accounts.

## 7. Build phases

1. **Setup:** create-next-app (TS, Tailwind, ESLint, App Router), Prettier, theme tokens, fonts, deploy to Vercel
2. **Data:** types, `lib/products.ts`, about 30 filler products, placeholder images
3. **Layout and core pages:** header, footer, home, category, product, search
4. **Affiliate plumbing:** `/go` route, BuyButtons, disclosure banner and page
5. **SEO and polish:**
   - Per-page metadata, `sitemap.xml`, `robots.txt`, Open Graph images
   - Product structured data (JSON-LD)
   - Check the responsive layout and run Lighthouse
6. **CMS migration:** move products into Sanity or Supabase, and add guide and blog articles ("Best tents under $200")
7. **Monorepo and Expo app:** browse screens first, then accounts, saved lists, and checklists
8. **Price tracking and alerts:** once affiliate API access is approved

**Status:**

- Phases 1–5: ✅ website done
- Phase 6: ✅ products, affiliate links, categories and trip templates are in the database, edited at `/admin` (Filament). Guide and blog articles are still to do.
- Phase 7: ✅ monorepo, plus the Expo app with browse, search, saved lists and trip checklists
- Accounts: ✅ email + password, Apple and Google sign-in. Browsing is open; saving, lists and trips need an account and sync between the website (`/my-gear`, `/trips`) and the app
- Platform move (October 2026): ✅ moved from Next.js + Supabase to Laravel + Inertia + React. URLs, features and the app's screens are unchanged. The app now loads the catalog from the API and caches it for offline browsing.
- Next: Apple / Google keys, deploy to Laravel Cloud or Forge (with the SSR server), point the app's `EXPO_PUBLIC_API_URL` at it, then phase 8

## 8. Verification

- `npm run test:web` (Pest, Pint, PHPStan), `npm run lint` and `npm run typecheck` pass, and `npm run build:web` builds
- `npm run dev:web`: click through home → category → product → buy button → `/go` redirect, at desktop and phone widths
- Filters, sorting, and search return the expected filler products
- Empty affiliate URLs show a disabled "Coming soon" button, with no broken redirects
- The Lighthouse SEO and accessibility scores are 90 or higher, and the sitemap lists every product page
