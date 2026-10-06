<?php

namespace App\Http\Resources;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The `Product` type in packages/shared/src/types.ts.
 *
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'brand' => $this->brand,
            'category' => $this->subcategory->category->slug,
            'subcategory' => $this->subcategory->slug,
            'shortDescription' => $this->short_description,
            'description' => $this->description,
            'images' => $this->images,
            'priceTier' => $this->price_tier,
            'rating' => $this->rating,
            'specs' => (object) $this->specs,
            'pros' => $this->pros,
            'cons' => $this->cons,
            'links' => $this->links->map(fn ($link) => [
                'retailer' => $link->retailer,
                'url' => $link->url ?? '',
            ])->all(),
            'featured' => $this->featured,
            'tags' => $this->tags,
        ];
    }
}
