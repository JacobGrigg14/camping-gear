<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

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
 * @property Carbon|null $deleted_at
 * @property-read Trip $trip
 */
#[Fillable(['label', 'section', 'product_slug', 'gear_category', 'gear_subcategory', 'checked', 'position'])]
class TripItem extends Model
{
    use HasUuids, MassPrunable, SoftDeletes;

    protected function casts(): array
    {
        return ['checked' => 'boolean'];
    }

    /**
     * Removed items stay restorable (undo) for a day, then `model:prune` deletes them.
     *
     * @return Builder<self>
     */
    public function prunable(): Builder
    {
        return static::onlyTrashed()->where('deleted_at', '<=', now()->subDay());
    }

    /** @return BelongsTo<Trip, $this> */
    public function trip(): BelongsTo
    {
        return $this->belongsTo(Trip::class);
    }
}
