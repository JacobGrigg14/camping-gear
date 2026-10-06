<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\V1\GearListController;
use App\Http\Resources\GearListResource;
use App\Models\GearList;
use App\Services\Catalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

/** Saved gear lists. Changes go through the JSON API (see routes/api.php). */
class MyGearController extends Controller
{
    public function __construct(private Catalog $catalog) {}

    public function index(Request $request): Response
    {
        $lists = GearListController::listsFor($request);
        // The first few products of each list, for thumbnails.
        $ids = $lists->flatMap(fn (GearList $l) => $l->productIds()->take(3))->unique();

        return Inertia::render('my-gear/index', [
            'lists' => GearListResource::collection($lists)->resolve(),
            'products' => Catalog::productData($this->catalog->products()->whereKey($ids)->get()),
        ]);
    }

    public function show(GearList $list): Response
    {
        Gate::authorize('view', $list);
        $list->load('items');
        $products = $this->catalog->products()->whereKey($list->productIds())->get()
            ->sortBy(fn ($p) => $list->productIds()->search($p->id));

        return Inertia::render('my-gear/show', [
            'list' => (new GearListResource($list))->resolve(),
            'products' => Catalog::productData($products),
        ]);
    }
}
