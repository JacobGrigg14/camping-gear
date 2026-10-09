<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GearListResource;
use App\Models\GearList;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class GearListController extends Controller
{
    /** The signed-in user's lists, Favorites first, then oldest to newest. */
    public function index(Request $request): AnonymousResourceCollection
    {
        return GearListResource::collection(self::listsFor($request));
    }

    /** Creates a list, optionally saving a first product to it. */
    public function store(Request $request): GearListResource
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'productId' => ['nullable', 'string', 'exists:products,id'],
        ]);

        $list = $request->user()->gearLists()->create(['name' => trim($data['name'])]);
        if ($data['productId'] ?? null) {
            $list->setProduct($data['productId'], true);
        }

        return new GearListResource($list->load('items'));
    }

    public function update(Request $request, GearList $list): GearListResource
    {
        Gate::authorize('update', $list);
        $data = $request->validate(['name' => ['required', 'string', 'max:80']]);
        $list->update(['name' => trim($data['name'])]);

        return new GearListResource($list->load('items'));
    }

    public function destroy(GearList $list): Response
    {
        Gate::authorize('delete', $list);
        $list->delete();

        return response()->noContent();
    }

    public function addProduct(GearList $list, string $productId): Response
    {
        Gate::authorize('update', $list);
        abort_unless(Product::whereKey($productId)->exists(), 404);
        $list->setProduct($productId, true);

        return response()->noContent();
    }

    public function removeProduct(GearList $list, string $productId): Response
    {
        Gate::authorize('update', $list);
        $list->setProduct($productId, false);

        return response()->noContent();
    }

    /** @return Collection<int, GearList> */
    public static function listsFor(Request $request): Collection
    {
        return $request->user()->gearLists()
            ->with('items')
            ->orderByDesc('is_favorites')
            ->orderBy('created_at')
            ->get();
    }
}
