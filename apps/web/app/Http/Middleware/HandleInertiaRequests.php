<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Api\V1\GearListController;
use App\Http\Resources\GearListResource;
use App\Services\Catalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [...parent::share($request), ...self::siteProps($request)];
    }

    /**
     * Props every page's layout needs. Also used for error pages, which can render before
     * this middleware runs.
     *
     * @return array<string, mixed>
     */
    public static function siteProps(Request $request): array
    {
        $user = $request->user();

        return [
            'auth' => [
                'user' => $user ? ['id' => $user->id, 'name' => $user->name, 'email' => $user->email] : null,
            ],
            // Header and footer navigation.
            'categories' => fn () => Cache::remember('nav-categories', 300, fn () => app(Catalog::class)->categories()
                ->map(fn ($c) => ['slug' => $c->slug, 'name' => $c->name])->all()),
            // So the heart on every product card knows what's saved.
            'lists' => fn () => $user ? GearListResource::collection(GearListController::listsFor($request))->resolve() : [],
            'siteUrl' => rtrim(config('app.url'), '/'),
        ];
    }
}
