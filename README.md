# Basecamp Outfitters (working name)

Camping gear affiliate project: a Laravel website (Inertia + React) and an Expo (React Native) app. Both use one catalog and one set of accounts, served by Laravel. See [PLAN.md](PLAN.md) for the full project plan.

## Repo layout (npm workspaces)

```
apps/web/          Laravel 13 + Inertia 3 + React + Tailwind 4 (server-side rendered).
                   Website, JSON API for the app (/api/v1), Filament admin (/admin)
apps/mobile/       Expo SDK 57 app (Expo Router), talks to apps/web's API
packages/shared/   @basecamp/shared: TS types, brand colors, site copy, search and catalog helpers,
                   and the typed API client used by both the website and the app
scripts/           generate-placeholders.mjs (filler images for both apps)
```

## Getting started

You need PHP 8.3+, Composer, Node 22 and PostgreSQL. [Laravel Herd](https://herd.laravel.com) gives you all of them (turn on its PostgreSQL service).

```bash
npm install                     # from the repo root, installs every JS workspace

cd apps/web
composer install
cp .env.example .env            # then check the DB_* settings
php artisan key:generate
createdb basecamp               # or create it in Herd / TablePlus
php artisan migrate --seed      # tables + the starter catalog + a local admin (admin@example.com / password)
cd ../..

npm run dev:web                 # website at http://localhost:8000 (server, queue, logs and Vite)
npm run dev:mobile              # Expo dev server; scan the QR code with Expo Go
npm run build:web               # production build of the website (client + SSR bundles)
npm run test:web                # Pest tests, Pint and PHPStan (needs a `basecamp_test` database)
npm run lint                    # lint and format check for the website's TS
npm run typecheck               # type-check every JS workspace
npm run format                  # format everything
npm run placeholders            # regenerate filler images
```

Server-side rendering in production: run `php artisan inertia:start-ssr` next to the web server (Laravel Cloud and Forge can run it as a daemon). Without it, pages still work but render in the browser only.

### Running the app on your phone

1. Install **Expo Go** from the App Store or Google Play.
2. The app needs the website's API. Start Laravel on your network with `cd apps/web && php artisan serve --host=0.0.0.0`.
3. Copy `apps/mobile/.env.example` to `apps/mobile/.env.local` and set `EXPO_PUBLIC_API_URL=http://<your-mac's-LAN-IP>:8000`.
4. Run `npm run dev:mobile` and scan the QR code (iPhone: Camera app; Android: Expo Go). Your phone and Mac need to be on the same Wi-Fi network.

You can also press `w` in the Expo terminal to open the app in a web browser.

The app keeps the last copy of the catalog on the device, so after the first launch it opens instantly and you can browse offline.

## Where things live

- **Admin:** `/admin` (Filament) for products, affiliate links, categories and trip templates. Only users with `is_admin` can open it.
- `apps/web/app/Models/`: Product, Category, Subcategory, ProductLink, ChecklistTemplate, GearList, Trip, TripItem, User
- `apps/web/app/Services/Catalog.php`: catalog reads used by both the website and the API
- `apps/web/app/Http/Controllers/`: website pages. `Api/V1/` holds the JSON API.
- `apps/web/app/Http/Resources/`: API response shapes. These match the types in `packages/shared`.
- `apps/web/app/Policies/`: who can see or change which lists and trips
- `apps/web/app/Http/Controllers/GoController.php`: outbound affiliate redirect (`/go/<product>/<retailer>`)
- `apps/web/resources/js/pages/`, `components/`: the website's React pages
- `apps/web/database/seeders/data/*.json`: the starter catalog (`php artisan db:seed --class=CatalogSeeder` re-applies it)
- `packages/shared/src/api/`: the typed API client (`createApiClient`)
- `apps/mobile/src/store/`: app state for the catalog, auth, lists and trips

## Adding affiliate links

Sign in at `/admin` → Products → edit a product → **Where to buy**. Paste the affiliate URL for each retailer. A retailer with an empty URL shows "coming soon" on both the website and the app. The "Affiliate links" filter on the product list shows which products still have pending links.

To make someone an admin: `php artisan tinker`, then `App\Models\User::where('email', 'you@example.com')->update(['is_admin' => true])`.

## Accounts

Anyone can browse. Saving gear, building lists and trip checklists need an account, and the same account works on the website and in the app.

- **Website:** email and password (Laravel Fortify): sign up, sign in, password reset. Plus Apple and Google.
- **App:** signs in through the API and stores a per-device token (Laravel Sanctum) in the iOS Keychain or Android Keystore. Apple and Google open the website's sign-in in the system browser, which sends the app back with a one-time code that it swaps for a token. This works in Expo Go.
- Password-reset emails link to the website. Set `MAIL_*` in `.env` to really send email; locally it goes to `storage/logs/laravel.log`.
- New users get a Favorites list automatically. It can be renamed but not deleted.
- "Delete account" (website and app) removes the account with its lists, trips and app sign-ins. The App Store requires this.

### Apple and Google sign-in (optional)

The buttons only appear once the keys are in `apps/web/.env`.

- **Google:** in Google Cloud Console, create an OAuth client (type "Web application") with the redirect URI `<APP_URL>/auth/google/callback`. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- **Apple:** needs an Apple Developer account. Create a Services ID with the return URL `<APP_URL>/auth/apple/callback`, plus a Sign in with Apple key. Set `APPLE_CLIENT_ID` (the Services ID), `APPLE_KEY_ID`, `APPLE_TEAM_ID` and `APPLE_PRIVATE_KEY` (the path to the `.p8` file). Apple only works over HTTPS, so test it on a real domain or with `herd secure`.

## Environment variables

- `apps/web/.env`: `APP_URL` (your real domain in production: sitemap, canonical URLs, sign-in callbacks), `DB_*`, `MAIL_*`, and the optional `GOOGLE_*` / `APPLE_*` keys.
- `apps/mobile/.env.local`: `EXPO_PUBLIC_API_URL`, the website's address. The app loads the catalog from it, signs in against it, and routes buy buttons through its `/go` redirect so click tracking lives in one place.
