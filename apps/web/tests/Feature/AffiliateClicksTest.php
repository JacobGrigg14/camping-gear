<?php

use App\Filament\Resources\Products\Pages\ListProducts;
use App\Filament\Widgets\AffiliateClicksOverview;
use App\Models\AffiliateClick;
use App\Models\Product;
use App\Models\User;
use Livewire\Livewire;

beforeEach(function () {
    seedCatalog();
    Product::find('ss-001')->links()->where('retailer', 'amazon')->update(['url' => 'https://www.amazon.com/dp/TEST']);
});

test('/go logs a click with its source and our own referring page', function () {
    $this->withHeader('referer', url('/gear/shelter-sleep/ridgeline-2p-backpacking-tent?x=1'))
        ->get('/go/ridgeline-2p-backpacking-tent/amazon')
        ->assertRedirect('https://www.amazon.com/dp/TEST');
    $this->withHeader('referer', 'https://elsewhere.example/page')
        ->get('/go/ridgeline-2p-backpacking-tent/amazon?src=app');

    expect(AffiliateClick::orderBy('id')->get(['product_id', 'retailer', 'source', 'referer_path'])->toArray())->toBe([
        ['product_id' => 'ss-001', 'retailer' => 'amazon', 'source' => 'web', 'referer_path' => '/gear/shelter-sleep/ridgeline-2p-backpacking-tent'],
        ['product_id' => 'ss-001', 'retailer' => 'amazon', 'source' => 'app', 'referer_path' => null],
    ]);
});

test('pending links, unknown products and bots are not counted', function () {
    $this->get('/go/ridgeline-2p-backpacking-tent/rei');
    $this->get('/go/nope/amazon');
    $this->withHeader('User-Agent', 'Mozilla/5.0 (compatible; Googlebot/2.1)')->get('/go/ridgeline-2p-backpacking-tent/amazon');

    expect(AffiliateClick::count())->toBe(0);
});

test('/go is rate limited', function () {
    foreach (range(1, 60) as $i) {
        $this->get('/go/ridgeline-2p-backpacking-tent/amazon')->assertRedirect();
    }
    $this->get('/go/ridgeline-2p-backpacking-tent/amazon')->assertTooManyRequests();
});

test('admins see click counts on the dashboard and the products table', function () {
    AffiliateClick::create(['product_id' => 'ss-001', 'retailer' => 'amazon', 'source' => 'web']);
    AffiliateClick::create(['product_id' => 'ss-001', 'retailer' => 'rei', 'source' => 'app']);
    $old = AffiliateClick::create(['product_id' => 'ss-001', 'retailer' => 'amazon', 'source' => 'web']);
    $old->forceFill(['created_at' => now()->subDays(31)])->save();

    $this->actingAs(User::factory()->create(['is_admin' => true]));

    Livewire::test(AffiliateClicksOverview::class)->assertSee('Last 30 days')->assertSee('Website 1 · App 1');
    Livewire::test(ListProducts::class)
        ->assertTableColumnStateSet('clicks_30d', 2, Product::find('ss-001'));
});
