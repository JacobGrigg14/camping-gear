<?php

use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(fn () => seedCatalog());

test('home page shows categories, featured and top rated gear', function () {
    $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('home')
        ->has('categories', 3)
        ->has('featured')
        ->has('topRated', 6)
        ->has('topRated.0', fn (Assert $p) => $p
            ->hasAll(['id', 'slug', 'name', 'brand', 'category', 'subcategory', 'shortDescription', 'description',
                'images', 'priceTier', 'rating', 'specs', 'pros', 'cons', 'links', 'featured', 'tags'])));
});

test('category page lists only that category', function () {
    $this->get('/gear/shelter-sleep')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('category')
        ->where('category.slug', 'shelter-sleep')
        ->has('category.subcategories', 4)
        ->where('products', fn ($products) => collect($products)->every(fn ($p) => $p['category'] === 'shelter-sleep')));
});

test('product page', function () {
    $this->get('/gear/shelter-sleep/ridgeline-2p-backpacking-tent')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('product')
        ->where('product.id', 'ss-001')
        ->where('subcategoryName', 'Tents')
        ->has('related', 3));
});

test('unknown pages and products in the wrong category are 404s', function (string $url) {
    $this->get($url)->assertNotFound()->assertInertia(fn (Assert $page) => $page->component('error'));
})->with(['/gear/nope', '/gear/packs-clothing/ridgeline-2p-backpacking-tent', '/gear/shelter-sleep/nope', '/nope']);

test('search page gets the whole catalog for instant search', function () {
    $this->get('/search?q=tent')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('search')
        ->where('query', 'tent')
        ->has('products', Product::count()));
});

test('/go redirects to the affiliate link once it is filled in', function () {
    $product = Product::find('ss-001');
    $product->links()->where('retailer', 'amazon')->update(['url' => 'https://www.amazon.com/dp/TEST?tag=x-20']);

    $this->get('/go/ridgeline-2p-backpacking-tent/amazon')
        ->assertRedirect('https://www.amazon.com/dp/TEST?tag=x-20')
        ->assertHeader('X-Robots-Tag', 'noindex, nofollow');
});

test('/go sends pending links back to the product page and unknown products home', function () {
    $this->get('/go/ridgeline-2p-backpacking-tent/rei')->assertRedirect('/gear/shelter-sleep/ridgeline-2p-backpacking-tent');
    $this->get('/go/ridgeline-2p-backpacking-tent/nowhere')->assertRedirect('/gear/shelter-sleep/ridgeline-2p-backpacking-tent');
    $this->get('/go/nope/amazon')->assertRedirect('/');
});

test('sitemap lists every product page', function () {
    $response = $this->get('/sitemap.xml')->assertOk()->assertHeader('Content-Type', 'application/xml');

    expect(substr_count($response->getContent(), '<url>'))->toBe(Product::count() + 3 + 3);
    $response->assertSee(url('/gear/shelter-sleep/ridgeline-2p-backpacking-tent'), false);
});

test('robots.txt points at the sitemap', function () {
    $this->get('/robots.txt')->assertOk()->assertSee('Sitemap: '.url('sitemap.xml'))->assertSee('Disallow: /go/');
});

test('old /signup address redirects to /register', function () {
    $this->get('/signup')->assertRedirect('/register');
});

test('catalog API returns everything the app needs in one response', function () {
    $this->getJson('/api/v1/catalog')->assertOk()
        ->assertJsonCount(3, 'categories')
        ->assertJsonCount(Product::count(), 'products')
        ->assertJsonCount(3, 'checklistTemplates')
        ->assertJsonPath('products.0.links.0.url', '')
        ->assertJsonStructure(['checklistTemplates' => [['id', 'name', 'description', 'sections' => [['title', 'items']]]]]);
});

test('product API', function () {
    $this->getJson('/api/v1/products/ridgeline-2p-backpacking-tent')->assertOk()
        ->assertJsonPath('id', 'ss-001')
        ->assertJsonPath('category', 'shelter-sleep')
        ->assertJsonPath('subcategory', 'tents');
    $this->getJson('/api/v1/products/nope')->assertNotFound();
});

test('search API matches every word across name, brand, type, descriptions and tags', function () {
    $names = fn (string $q) => collect($this->getJson('/api/v1/search?q='.urlencode($q))->assertOk()->json())->pluck('slug');

    expect($names('tent'))->toContain('ridgeline-2p-backpacking-tent', 'timberwolf-6p-cabin-tent');
    expect($names('Ridgeline TENT'))->toContain('ridgeline-2p-backpacking-tent')->not->toContain('timberwolf-6p-cabin-tent');
    expect($names('backpacking'))->toContain('ridgeline-2p-backpacking-tent'); // a tag
    expect($names('zzzz'))->toBeEmpty();
    expect($names(''))->toBeEmpty();
    expect($names('100%'))->toBeEmpty();
});
