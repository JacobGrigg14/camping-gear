<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $product_id
 * @property string $retailer
 * @property string|null $url
 * @property int $position
 */
#[Fillable(['retailer', 'url', 'position'])]
class ProductLink extends Model
{
    /** Retailers we have (or plan to have) affiliate programs with. Mirrors packages/shared/src/retailers.ts. */
    public const array RETAILERS = [
        'amazon' => 'Amazon',
        'mec' => 'MEC',
        'bass-pro' => 'Bass Pro Shops',
        'rei' => 'REI',
    ];

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
