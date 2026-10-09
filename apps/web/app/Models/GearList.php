<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * @property string $id
 * @property int $user_id
 * @property string $name
 * @property bool $is_favorites
 * @property Carbon $created_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, GearListItem> $items
 */
#[Fillable(['name', 'is_favorites'])]
class GearList extends Model
{
    use HasUuids;

    protected function casts(): array
    {
        return ['is_favorites' => 'boolean'];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Most recently saved first.
     *
     * @return HasMany<GearListItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(GearListItem::class)->orderByDesc('created_at');
    }

    /** @return Collection<int, string> */
    public function productIds(): Collection
    {
        return $this->items->pluck('product_id');
    }

    public function setProduct(string $productId, bool $saved): void
    {
        if ($saved) {
            $this->items()->firstOrCreate(['product_id' => $productId]);
        } else {
            $this->items()->where('product_id', $productId)->delete();
        }
    }
}
