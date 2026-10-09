<?php

namespace App\Http\Resources;

use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The `Trip` type in packages/shared/src/api/types.ts.
 *
 * @mixin Trip
 */
class TripResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'templateId' => $this->template_id,
            'createdAt' => $this->created_at->toIso8601String(),
            'items' => TripItemResource::collection($this->items)->resolve($request),
        ];
    }
}
