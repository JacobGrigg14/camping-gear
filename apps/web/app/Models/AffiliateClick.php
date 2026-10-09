<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * An outbound click on a buy button, logged by GoController. Holds no visitor data.
 *
 * @property int $id
 * @property string $product_id
 * @property string $retailer
 * @property string $source web or app
 * @property string|null $referer_path
 * @property Carbon $created_at
 * @property-read Product $product
 */
#[Fillable(['product_id', 'retailer', 'source', 'referer_path'])]
class AffiliateClick extends Model
{
    public const array SOURCES = ['web', 'app'];

    public const null UPDATED_AT = null;

    /** @return BelongsTo<Product, $this> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
