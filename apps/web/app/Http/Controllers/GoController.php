<?php

namespace App\Http\Controllers;

use App\Models\AffiliateClick;
use App\Models\Product;
use App\Services\Catalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Outbound affiliate redirect: /go/<product-slug>/<retailer>.
 * Keeps affiliate URLs in one place (the website and the app both link here) and counts clicks.
 * The app adds ?src=app so clicks can be split by source.
 */
class GoController extends Controller
{
    public function __invoke(Request $request, Catalog $catalog, string $slug, string $retailer): RedirectResponse
    {
        $product = $catalog->product($slug);
        if (! $product) {
            return redirect('/');
        }

        // While a link is still pending, send the visitor back to the product page.
        $url = $product->affiliateUrl($retailer);
        if ($url && ! $this->isBot($request)) {
            $this->logClick($request, $product, $retailer);
        }

        return ($url ? redirect()->away($url, 302) : redirect($product->path(), 302))
            ->header('X-Robots-Tag', 'noindex, nofollow');
    }

    private function logClick(Request $request, Product $product, string $retailer): void
    {
        // Only keep the path of our own pages, never other sites' URLs or query strings.
        $referer = (string) $request->headers->get('referer');
        $sameSite = parse_url($referer, PHP_URL_HOST) === $request->getHost();

        AffiliateClick::create([
            'product_id' => $product->id,
            'retailer' => $retailer,
            'source' => $request->query('src') === 'app' ? 'app' : 'web',
            'referer_path' => $sameSite ? substr((string) parse_url($referer, PHP_URL_PATH), 0, 255) : null,
        ]);
    }

    /** Crawlers and link previews follow /go links too; don't count them. */
    private function isBot(Request $request): bool
    {
        return (bool) preg_match('/bot|crawl|spider|slurp|preview|facebookexternalhit|headless/i', (string) $request->userAgent());
    }
}
