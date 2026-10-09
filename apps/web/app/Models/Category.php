<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\Cache;

/**
 * @property int $id
 * @property string $slug
 * @property string $name
 * @property string $tagline
 * @property string $description
 * @property string $image
 * @property int $position
 */
#[Fillable(['slug', 'name', 'tagline', 'description', 'image', 'position'])]
class Category extends Model
{
    protected static function booted(): void
    {
        // The header and footer navigation is cached (see HandleInertiaRequests).
        static::saved(fn () => Cache::forget('nav-categories'));
        static::deleted(fn () => Cache::forget('nav-categories'));
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** @return HasMany<Subcategory, $this> */
    public function subcategories(): HasMany
    {
        return $this->hasMany(Subcategory::class)->orderBy('position');
    }

    /** @return HasManyThrough<Product, Subcategory, $this> */
    public function products(): HasManyThrough
    {
        return $this->hasManyThrough(Product::class, Subcategory::class);
    }
}
