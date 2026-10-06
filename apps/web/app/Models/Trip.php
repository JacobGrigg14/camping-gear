<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property int $user_id
 * @property string $name
 * @property string|null $template_id
 * @property Carbon $created_at
 * @property-read Collection<int, TripItem> $items
 */
#[Fillable(['name', 'template_id'])]
class Trip extends Model
{
    use HasUuids;

    /** Section for items the user adds themselves. Mirrors CUSTOM_SECTION in packages/shared. */
    public const string CUSTOM_SECTION = 'My items';

    /** Custom items sort after template items, then by when they were added. */
    public const int CUSTOM_POSITION = 1_000_000;

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<TripItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(TripItem::class)->orderBy('position')->orderBy('created_at');
    }

    /** Creates a trip for the user, copying the template's checklist if one is given. */
    public static function createFor(User $user, string $name, ?ChecklistTemplate $template = null): self
    {
        $trip = $user->trips()->create(['name' => $name, 'template_id' => $template?->id]);

        $position = 0;
        foreach ($template->sections ?? [] as $section) {
            foreach ($section['items'] as $item) {
                $trip->items()->create([
                    'label' => $item['label'],
                    'section' => $section['title'],
                    'product_slug' => $item['productSlug'] ?? null,
                    'gear_category' => $item['gear']['category'] ?? null,
                    'gear_subcategory' => $item['gear']['subcategory'] ?? null,
                    'position' => $position++,
                ]);
            }
        }

        return $trip->load('items');
    }

    public function addCustomItem(string $label): TripItem
    {
        return $this->items()->create([
            'label' => $label,
            'section' => self::CUSTOM_SECTION,
            'position' => self::CUSTOM_POSITION,
        ]);
    }
}
