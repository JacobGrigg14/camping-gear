# Camping Gear Affiliate Site + App — Project Plan

## Context
The repo is empty (just a README). We're building a camping gear affiliate business: **website first, mobile app second**. The site lists camping gear. Each item has buy buttons that link out to retailers (Amazon, Bass Pro Shops, Cabela's, etc.) through affiliate links, and we earn a commission on each sale. At launch every product uses placeholder images and placeholder info, and the real affiliate links get pasted in later.

**Decisions so far:**
- **Stack:** Next.js + TypeScript for the site, Expo (React Native) for the app
- **Product data:** data files in the repo now, a CMS later
- **App features:** everything the site does, plus saved gear lists, trip checklists, and price-drop alerts
- **Name:** a placeholder for now. Working name **"Basecamp Outfitters"**, kept in one config file so it's easy to swap.
- **Launch categories:** Shelter & Sleep, Packs & Clothing, Lighting/Tools/Furniture
- **Look:** rugged and outdoorsy, with earthy greens and browns and a textured feel (think Bass Pro or Cabela's)

---

## 1. Tech stack
| Layer | Choice |
|---|---|
| Website | **Next.js 15 (App Router) + TypeScript**, mostly static pages for SEO |
| Styling | **Tailwind CSS**, with a custom earthy theme: forest green, bark brown, canvas tan, ember orange for buttons. Headings in a rugged serif or slab font (e.g. "Bitter" or "Roboto Slab"), body text in "Inter". |
| Product data (phase 1) | Typed TS data files in `src/data/` |
| CMS (phase 2) | Sanity or Supabase, whichever we pick when we get there. The data access layer (`src/lib/products.ts`) means only one file has to change. |
| Accounts and user data (app phase) | **Supabase** (auth + Postgres). Saved lists, checklists, and alert subscriptions need user accounts. |
| Hosting | **Vercel** for the site. Expo EAS for app builds and store submission. |
| Mobile | **Expo (React Native) + Expo Router**, sharing types and data access with the site through a monorepo |

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
In the app phase this becomes a monorepo (`apps/web`, `apps/mobile`, `packages/shared`) using npm or pnpm workspaces. `types/` and `lib/products.ts` move into `packages/shared`.

## 3. Data model
```ts
type Retailer = 'amazon' | 'bass-pro' | 'cabelas' | 'rei' | 'backcountry';
type Product = {
  id: string; slug: string; name: string; brand: string;
  category: 'shelter-sleep' | 'packs-clothing' | 'lighting-tools-furniture';
  subcategory: string;            // tents, sleeping-bags, backpacks, headlamps, chairs...
  shortDescription: string; description: string;
  images: string[];
  priceTier: '$' | '$$' | '$$$' | '$$$$';  // no hard prices (Amazon rules); real prices later via APIs
  rating: number;                 // our editorial rating
  specs: Record<string, string>;
  pros: string[]; cons: string[];
  links: { retailer: Retailer; url: string }[];  // url = "" until real affiliate links arrive
  featured?: boolean; tags: string[];
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
  - Clicks can be counted later (Vercel Analytics or a Supabase table).
  - If a link is still empty, the button shows "Coming soon" and is disabled.
- All outbound links get `rel="sponsored nofollow noopener"` and open in a new tab.
- **Compliance:**
  - A short disclosure line sits near the buy buttons on every page, and there's a full `/disclosure` page. The FTC requires this.
  - Amazon Associates has its own required wording.
  - No hard-coded Amazon prices.
- Affiliate programs to apply for later: Amazon Associates, Bass Pro/Cabela's (they're one company), REI, Backcountry. These run directly or through networks like AvantLink, CJ, or Impact.

## 6. Mobile app (later phase)
- Expo app with the same browse, search, and product screens, reading the shared data layer
- **Accounts:** Supabase Auth (email, Apple, Google)
- **Saved gear lists:** favorite products and named kits (e.g. "Winter backpacking kit"), synced across devices. The website can get these too.
- **Trip checklists:** packing-list templates by trip type. Each checklist item can link to a recommended product.
- **Price-drop alerts:** need real price data:
  - Amazon Product Advertising API, which only unlocks after the Associates account makes qualifying sales
  - Affiliate network product feeds for the other retailers
  - A scheduled job (Supabase cron or Vercel cron) stores price history and sends push notifications through Expo Notifications
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
- Phase 6: skipped for now
- Phase 7: ✅ monorepo, plus the Expo app with browse, search, saved lists and trip checklists (stored on the device)
- Next: Supabase accounts and sync for lists and trips, deploying the site, then phase 8

## 8. Verification
- `npm run build` passes, with no TypeScript or ESLint errors
- `npm run dev`: click through home → category → product → buy button → `/go` redirect, at desktop and phone widths
- Filters, sorting, and search return the expected filler products
- Empty affiliate URLs show a disabled "Coming soon" button, with no broken redirects
- The Lighthouse SEO and accessibility scores are 90 or higher, and the sitemap lists every product page
