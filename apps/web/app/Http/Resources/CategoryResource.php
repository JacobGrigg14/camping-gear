<?php

namespace App\Http\Resources;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The `Category` type in packages/shared/src/types.ts.
 *
 * @mixin Category
 */
class CategoryResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'tagline' => $this->tagline,
            'description' => $this->description,
            'image' => $this->image,
            'subcategories' => $this->subcategories->map(fn ($s) => ['slug' => $s->slug, 'name' => $s->name])->all(),
        ];
    }
}
