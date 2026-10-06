<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\GoController;
use App\Http\Controllers\MyGearController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SocialLoginController;
use App\Http\Controllers\TripController;
use Illuminate\Support\Facades\Route;

// Catalog -----------------------------------------------------------------------

Route::get('/', [CatalogController::class, 'home'])->name('home');
Route::get('gear/{category:slug}', [CatalogController::class, 'category'])->name('category');
Route::get('gear/{category:slug}/{slug}', [CatalogController::class, 'product'])->name('product');
Route::get('search', [CatalogController::class, 'search'])->name('search');
Route::inertia('about', 'about')->name('about');
Route::inertia('disclosure', 'disclosure')->name('disclosure');

// Outbound affiliate redirect: /go/<product-slug>/<retailer>.
Route::get('go/{slug}/{retailer}', GoController::class)->name('go');

Route::get('sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('robots.txt', fn () => response(implode("\n", [
    'User-agent: *',
    'Allow: /',
    ...array_map(fn ($path) => "Disallow: {$path}", [
        '/go/', '/search', '/login', '/register', '/signup', '/forgot-password', '/reset-password/',
        '/auth/', '/account', '/my-gear', '/trips', '/admin',
    ]),
    '',
    'Sitemap: '.url('sitemap.xml'),
    '',
]), 200, ['Content-Type' => 'text/plain']))->name('robots');

// Accounts ----------------------------------------------------------------------

// Old sign-up URL.
Route::redirect('signup', '/register');

// Apple / Google sign-in for the website and the app. Apple posts its callback.
Route::get('auth/{provider}/redirect', [SocialLoginController::class, 'redirect'])
    ->whereIn('provider', SocialLoginController::PROVIDERS)
    ->name('social.redirect');
Route::match(['get', 'post'], 'auth/{provider}/callback', [SocialLoginController::class, 'callback'])
    ->whereIn('provider', SocialLoginController::PROVIDERS)
    ->name('social.callback');

Route::middleware('auth')->group(function () {
    Route::get('account', [AccountController::class, 'show'])->name('account');
    Route::put('account/password', [AccountController::class, 'updatePassword'])->name('account.password');
    Route::delete('account', [AccountController::class, 'destroy'])->name('account.destroy');

    Route::get('my-gear', [MyGearController::class, 'index'])->name('my-gear');
    Route::get('my-gear/{list}', [MyGearController::class, 'show'])->whereUuid('list')->name('my-gear.show');

    Route::get('trips', [TripController::class, 'index'])->name('trips');
    Route::get('trips/{trip}', [TripController::class, 'show'])->whereUuid('trip')->name('trips.show');
});
