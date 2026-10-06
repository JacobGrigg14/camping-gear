<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $trip_id
 * @property string $label
 * @property string $section
 * @property string|null $product_slug
 * @property string|null $gear_category
 * @property string|null $gear_subcategory
 * @property bool $checked
 * @property int $position
 * @property-read Trip $trip
 */
#[Fillable(['label', 'section', 'product_slug', 'gear_category', 'gear_subcategory', 'checked', 'position'])]
class TripItem extends Model
{
    use HasUuids;

    protected function casts(): array
    {
        return ['checked' => 'boolean'];
    }

    /** @return BelongsTo<Trip, $this> */
    public function trip(): BelongsTo
    {
        return $this->belongsTo(Trip::class);
    }
}
