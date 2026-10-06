<?php

namespace App\Http\Resources;

use App\Models\TripItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The `TripItem` type in packages/shared/src/api/types.ts.
 *
 * @mixin TripItem
 */
class TripItemResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'section' => $this->section,
            'checked' => $this->checked,
            'productSlug' => $this->product_slug,
            'gear' => $this->gear_category && $this->gear_subcategory
                ? ['category' => $this->gear_category, 'subcategory' => $this->gear_subcategory]
                : null,
        ];
    }
}
