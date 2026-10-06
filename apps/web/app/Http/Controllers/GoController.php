<?php

namespace App\Http\Controllers;

use App\Services\Catalog;
use Illuminate\Http\RedirectResponse;

/**
 * Outbound affiliate redirect: /go/<product-slug>/<retailer>.
 * Keeps affiliate URLs in one place (the website and the app both link here) and gives us
 * a hook for click tracking later.
 */
class GoController extends Controller
{
    public function __invoke(Catalog $catalog, string $slug, string $retailer): RedirectResponse
    {
        $product = $catalog->product($slug);
        if (! $product) {
            return redirect('/');
        }

        // While a link is still pending, send the visitor back to the product page.
        $url = $product->affiliateUrl($retailer);

        return ($url ? redirect()->away($url, 302) : redirect($product->path(), 302))
            ->header('X-Robots-Tag', 'noindex, nofollow');
    }
}
