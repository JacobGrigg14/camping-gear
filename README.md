# Basecamp Outfitters (working name)

Camping gear affiliate site built with Next.js 16, TypeScript and Tailwind CSS v4. See [PLAN.md](PLAN.md) for the full project plan.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run format
npm run placeholders   # regenerate filler images in public/placeholders
```

## Where things live

- `src/data/products/*.ts`: product catalog (filler for now)
- `src/data/categories.ts`: categories and subcategories
- `src/lib/products.ts`: the only data access layer pages use (swap this when moving to a CMS)
- `src/lib/site.ts`: site name, tagline, disclosure text
- `src/app/go/[slug]/[retailer]/route.ts`: outbound affiliate redirect

## Adding affiliate links

Find the product in `src/data/products/` and fill in the `url` for each retailer:

```ts
links: [{ retailer: "amazon", url: "https://www.amazon.com/dp/XXXX?tag=yourtag-20" }],
```

Buttons with an empty `url` show "coming soon". Once a URL is filled in, the button links to `/go/<slug>/<retailer>`, which redirects to the affiliate URL.

Set `NEXT_PUBLIC_SITE_URL` in production so the sitemap and canonical URLs use your real domain.
