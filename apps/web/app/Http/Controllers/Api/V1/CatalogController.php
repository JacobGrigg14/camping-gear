<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChecklistTemplateResource;
use App\Http\Resources\ProductResource;
use App\Models\ChecklistTemplate;
use App\Services\Catalog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CatalogController extends Controller
{
    public function __construct(private Catalog $catalog) {}

    /**
     * The whole catalog in one response. It's small, so the app loads it once and caches it
     * for offline browsing.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'categories' => Catalog::categoryData($this->catalog->categories()),
            'products' => Catalog::productData($this->catalog->products()->orderBy('id')->get()),
            'checklistTemplates' => ChecklistTemplateResource::collection(
                ChecklistTemplate::orderBy('position')->get(),
            )->resolve(),
        ]);
    }

    public function product(string $slug): ProductResource
    {
        return new ProductResource($this->catalog->product($slug) ?? abort(404));
    }

    public function search(Request $request): AnonymousResourceCollection
    {
        return ProductResource::collection($this->catalog->search((string) $request->query('q', '')));
    }
}
