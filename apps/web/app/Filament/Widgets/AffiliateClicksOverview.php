<?php

namespace App\Filament\Widgets;

use App\Models\AffiliateClick;
use App\Models\ProductLink;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

/** Outbound affiliate clicks for the admin dashboard. Per-product counts are on the products table. */
class AffiliateClicksOverview extends StatsOverviewWidget
{
    protected ?string $heading = 'Affiliate clicks';

    protected ?string $description = 'Clicks through to retailers, last 30 days unless noted.';

    /** @return list<Stat> */
    protected function getStats(): array
    {
        $since = now()->subDays(30);
        $byRetailer = AffiliateClick::where('created_at', '>=', $since)
            ->selectRaw('retailer, count(*) as total')
            ->groupBy('retailer')
            ->pluck('total', 'retailer');
        $bySource = AffiliateClick::where('created_at', '>=', $since)
            ->selectRaw('source, count(*) as total')
            ->groupBy('source')
            ->pluck('total', 'source');

        return [
            Stat::make('Today', AffiliateClick::where('created_at', '>=', today())->count()),
            Stat::make('Last 30 days', $byRetailer->sum())
                ->description(sprintf('Website %d · App %d', $bySource['web'] ?? 0, $bySource['app'] ?? 0)),
            ...collect(ProductLink::RETAILERS)
                ->map(fn (string $name, string $key) => Stat::make($name, (int) ($byRetailer[$key] ?? 0)))
                ->values()
                ->all(),
        ];
    }
}
