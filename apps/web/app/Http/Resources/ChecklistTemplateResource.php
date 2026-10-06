<?php

namespace App\Http\Resources;

use App\Models\ChecklistTemplate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The `ChecklistTemplate` type in packages/shared/src/checklists.ts.
 *
 * @mixin ChecklistTemplate
 */
class ChecklistTemplateResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'sections' => $this->sections,
        ];
    }
}
