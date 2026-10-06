<?php

namespace App\Http\Resources;

use App\Models\GearList;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The `GearList` type in packages/shared/src/api/types.ts.
 *
 * @mixin GearList
 */
class GearListResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'isFavorites' => $this->is_favorites,
            'productIds' => $this->productIds()->all(),
            'createdAt' => $this->created_at->toIso8601String(),
        ];
    }
}
