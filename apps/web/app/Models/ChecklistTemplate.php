<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * A packing-list template (e.g. "Weekend car camping") that new trips copy from.
 *
 * @property string $id
 * @property string $name
 * @property string $description
 * @property list<array{title: string, items: list<array{label: string, productSlug?: string, gear?: array{category: string, subcategory: string}}>}> $sections
 * @property int $position
 */
#[Fillable(['id', 'name', 'description', 'sections', 'position'])]
class ChecklistTemplate extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected function casts(): array
    {
        return ['sections' => 'array'];
    }
}
