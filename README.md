# Basecamp Outfitters (working name)

Camping gear affiliate project: a Next.js website and an Expo (React Native) app that share one product catalog. See [PLAN.md](PLAN.md) for the full project plan.

## Repo layout (npm workspaces)

```
apps/web/          Next.js 16 + Tailwind website
apps/mobile/       Expo SDK 57 app (Expo Router)
packages/shared/   @basecamp/shared: product data, types, catalog/search helpers, checklist templates, brand colors,
                   and the Supabase data layer (src/db) used by both apps
supabase/          database migrations (accounts, lists, trips)
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
- `packages/shared/src/db/`: reads and writes for lists and trips (both apps call these)
- `supabase/migrations/`: database tables and security rules
- `apps/web/src/app/{login,signup,account,my-gear,trips}`: website account pages
- `apps/mobile/src/store/`: app state for auth, lists and trips (backed by Supabase)

## Adding affiliate links

Find the product in `packages/shared/src/data/products/` and fill in the `url` for each retailer:

```ts
links: [{ retailer: "amazon", url: "https://www.amazon.com/dp/XXXX?tag=yourtag-20" }],
```

Buttons with an empty `url` show "coming soon" on both the website and the app.

## Accounts (Supabase)

Anyone can browse. Saving gear, building lists and trip checklists need an account, and the same account works on the website and in the app.

### One-time setup

1. Create a project at [supabase.com](https://supabase.com).
2. **Database:** open SQL Editor, paste `supabase/migrations/20261005000000_accounts.sql` and run it.
   (Or with the CLI: `npx supabase link --project-ref <ref>` then `npx supabase db push`.)
3. **Keys:** Project Settings → API. Copy `apps/web/.env.example` to `apps/web/.env.local` and `apps/mobile/.env.example` to `apps/mobile/.env.local`, then fill in the URL and the publishable (anon) key.
4. **Redirect URLs:** Authentication → URL Configuration.
   - Site URL: `http://localhost:3000` (your real domain later).
   - Redirect URLs: `http://localhost:3000/auth/callback`, `basecamp://auth/callback`, `exp://**`.
5. **Google:** create an OAuth client (type "Web application") in Google Cloud Console with the redirect URI shown in Supabase → Authentication → Providers → Google, then paste the client ID and secret there.
6. **Apple:** needs an Apple Developer account. Create a Services ID and a Sign in with Apple key, then enter them in Supabase → Providers → Apple.

Email + password works after steps 1–4. The Apple and Google buttons show an error until steps 5–6 are done.

Without any keys, the site and app still run. Saving just shows an "accounts aren't switched on yet" message.

### Notes

- Each table has row-level security, so people can only read and change their own lists and trips.
- New users get a Favorites list automatically (a database trigger).
- "Delete account" (website and app) calls the `delete_account()` database function, which the App Store requires.
- If you change the schema, regenerate types: `npx supabase gen types typescript --linked > packages/shared/src/db/database.types.ts`.
- In Expo Go, Apple and Google sign-in go through the browser. A development build can switch to the native sign-in sheets later.

## Environment variables

- `NEXT_PUBLIC_SITE_URL` (web): your real domain, used for the sitemap and canonical URLs.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (web) and `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (mobile): the same Supabase project for both.
- `EXPO_PUBLIC_SITE_URL` (mobile): once the website is deployed, app buy buttons route through `<site>/go/...` so click tracking lives in one place. Without it, they open the affiliate URL directly. It also points app email links (sign-up confirmation, password reset) at the website.
