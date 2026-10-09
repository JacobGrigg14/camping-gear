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

## Going live (Laravel Forge)

1. **Server:** in Forge, create a server (DigitalOcean or Hetzner, 2 GB RAM or more) with PHP 8.4, PostgreSQL and Node 22. Note the database password Forge shows.
2. **Site:** add a site for your domain, connect this repo, and set the **web directory** to `/apps/web/public`. Point the domain's DNS (A record) at the server, then turn on **SSL → Let's Encrypt**.
3. **Environment:** in the site's Environment tab, start from `apps/web/.env.example` and set at least:

   | Setting | Value |
   | --- | --- |
   | `APP_ENV` / `APP_DEBUG` | `production` / `false` |
   | `APP_URL` | `https://yourdomain.com` |
   | `APP_KEY` | generate with `php artisan key:generate --show` |
   | `LOG_LEVEL` | `warning` |
   | `DB_*` | the database Forge created |
   | `SESSION_SECURE_COOKIE` | `true` |
   | `MAIL_*` | your email provider (Postmark, Resend, SES…) and a real `MAIL_FROM_ADDRESS` |
   | `GOOGLE_*`, `APPLE_*` | sign-in keys; callback URLs are `https://yourdomain.com/auth/{google,apple}/callback` |
   | `VITE_GA_MEASUREMENT_ID` | your GA4 ID (`G-…`); empty turns analytics off |
   | `SENTRY_LARAVEL_DSN`, `VITE_SENTRY_DSN` | from sentry.io; empty turns error reporting off |
   | `TRUSTED_PROXIES` | leave empty unless you put Cloudflare or a load balancer in front |

   `VITE_*` values are baked in when the site builds, so redeploy after changing them.
4. **Deploy script:** paste [`apps/web/forge-deploy.sh`](apps/web/forge-deploy.sh) into the site's deploy script and turn on quick deploy for `main`.
5. **Daemons** (Server → Daemons, directory `/home/forge/<site>/apps/web`):
   - `php artisan queue:work --tries=3 --max-time=3600`
   - `php artisan inertia:start-ssr` (server-side rendering, which search engines rely on)
6. **Scheduler:** Server → Scheduler → add `php /home/forge/<site>/apps/web/artisan schedule:run`, every minute. It runs the daily cleanup of removed trip items.
7. **Backups:** turn on Forge's database backups (Server → Backups) to S3 or similar.
8. **First admin:** sign up on the live site, then on the server run `php artisan app:make-admin you@example.com`. The local `admin@example.com` account is only seeded in local development.
9. **After launch:** verify the domain in Google Search Console and submit `https://yourdomain.com/sitemap.xml`. Point the app at the live API (`EXPO_PUBLIC_API_URL`) before building it for the stores.

## Publishing the app (EAS)

You need an [Expo account](https://expo.dev), an Apple Developer account ($99/year) and a Google Play developer account ($25 once).

1. In `apps/mobile/eas.json`, replace `https://yourdomain.com` with the live website's address (both profiles).
2. `cd apps/mobile && npx eas-cli login && npx eas-cli init` links the project to your Expo account (it adds `owner` and `projectId` to `app.json`).
3. `npx eas-cli build --profile preview --platform all` makes test builds you can install on your own phones.
4. `npx eas-cli build --profile production --platform all`, then `npx eas-cli submit --platform ios` and `--platform android`. Build numbers count up automatically.
5. In App Store Connect and the Play Console, fill in the listing and use `https://yourdomain.com/privacy` as the privacy policy URL. The app collects an email address (for accounts) and doesn't track users.

## Where things live

- **Admin:** `/admin` (Filament) for products, affiliate links, categories and trip templates. Only users with `is_admin` can open it. The dashboard shows affiliate clicks by retailer and source, and the product list has a "Clicks (30 days)" column.
- `apps/web/app/Models/`: Product, Category, Subcategory, ProductLink, ChecklistTemplate, GearList, Trip, TripItem, User
- `apps/web/app/Services/Catalog.php`: catalog reads used by both the website and the API
- `apps/web/app/Http/Controllers/`: website pages. `Api/V1/` holds the JSON API.
- `apps/web/app/Http/Resources/`: API response shapes. These match the types in `packages/shared`.
- `apps/web/app/Policies/`: who can see or change which lists and trips
- `apps/web/app/Http/Controllers/GoController.php`: outbound affiliate redirect (`/go/<product>/<retailer>`). Logs each click to `affiliate_clicks` (no visitor data; bots skipped).
- `packages/shared/src/legal.ts`: the privacy policy and terms of use, shown on the website (`/privacy`, `/terms`) and in the app. **Starting drafts; have them reviewed before launch.**
- `packages/shared/src/site.ts`: site name, tagline, contact email and the affiliate disclosure wording
- `apps/web/resources/js/lib/analytics.ts`: Google Analytics 4, loaded only after the visitor accepts the cookie banner
- `apps/web/resources/js/pages/`, `components/`: the website's React pages
- `apps/web/database/seeders/data/*.json`: the starter catalog (`php artisan db:seed --class=CatalogSeeder` re-applies it)
- `packages/shared/src/api/`: the typed API client (`createApiClient`)
- `apps/mobile/src/store/`: app state for the catalog, auth, lists and trips

## Adding affiliate links

Sign in at `/admin` → Products → edit a product → **Where to buy**. Paste the affiliate URL for each retailer. A retailer with an empty URL shows "coming soon" on both the website and the app. The "Affiliate links" filter on the product list shows which products still have pending links.

To make someone an admin: `php artisan app:make-admin you@example.com` (they need an account first).

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

- `apps/web/.env`: `APP_URL` (your real domain in production: sitemap, canonical URLs, sign-in callbacks), `DB_*`, `MAIL_*`, and the optional `GOOGLE_*` / `APPLE_*` keys. Optional in production: `VITE_GA_MEASUREMENT_ID` (Google Analytics), `SENTRY_LARAVEL_DSN` and `VITE_SENTRY_DSN` (error reporting), `TRUSTED_PROXIES`. See [Going live](#going-live-laravel-forge).
- `apps/mobile/.env.local`: `EXPO_PUBLIC_API_URL`, the website's address. The app loads the catalog from it, signs in against it, and routes buy buttons through its `/go` redirect so click tracking lives in one place.
