<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * @property string $id
 * @property string $slug
 * @property string $name
 * @property string $brand
 * @property int $subcategory_id
 * @property string $short_description
 * @property string $description
 * @property list<string> $images
 * @property string $price_tier
 * @property float $rating
 * @property array<string, string> $specs
 * @property list<string> $pros
 * @property list<string> $cons
 * @property list<string> $tags
 * @property bool $featured
 * @property-read Subcategory $subcategory
 * @property-read Collection<int, ProductLink> $links
 */
#[Fillable([
    'id', 'slug', 'name', 'brand', 'subcategory_id', 'short_description', 'description',
    'images', 'price_tier', 'rating', 'specs', 'pros', 'cons', 'tags', 'featured',
])]
class Product extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    /** Relations every product response needs. */
    public const array WITH = ['subcategory.category', 'links'];

    protected static function booted(): void
    {
        // Products created in the admin get a short random id; seeded ones keep theirs.
        static::creating(function (Product $product) {
            $product->id ??= Str::lower(Str::random(10));
        });
    }

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'rating' => 'float',
            'specs' => 'array',
            'pros' => 'array',
            'cons' => 'array',
            'tags' => 'array',
            'featured' => 'boolean',
        ];
    }

    /** @return BelongsTo<Subcategory, $this> */
    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Subcategory::class);
    }

    /** @return HasMany<ProductLink, $this> */
    public function links(): HasMany
    {
        return $this->hasMany(ProductLink::class)->orderBy('position');
    }

    /** @param Builder<Product> $query */
    public function scopeInCategory(Builder $query, Category $category): void
    {
        $query->whereHas('subcategory', fn (Builder $q) => $q->where('category_id', $category->id));
    }

    public function path(): string
    {
        return "/gear/{$this->subcategory->category->slug}/{$this->slug}";
    }

    /** The affiliate URL for a retailer, or null while the link is pending. */
    public function affiliateUrl(string $retailer): ?string
    {
        return $this->links->firstWhere('retailer', $retailer)?->url ?: null;
    }
}
