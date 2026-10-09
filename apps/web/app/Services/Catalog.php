<?php

namespace App\Services;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/**
 * Catalog reads shared by the website and the API (ported from packages/shared/src/catalog.ts).
 */
class Catalog
{
    /** @return Collection<int, Category> */
    public function categories(): Collection
    {
        return Category::with('subcategories')->orderBy('position')->get();
    }

    /** @return Builder<Product> */
    public function products(): Builder
    {
        return Product::with(Product::WITH);
    }

    public function product(string $slug): ?Product
    {
        return $this->products()->where('slug', $slug)->first();
    }

    /** @return Collection<int, Product> */
    public function inCategory(Category $category): Collection
    {
        return $this->products()->inCategory($category)->orderByDesc('rating')->get();
    }

    /** @return Collection<int, Product> */
    public function featured(): Collection
    {
        return $this->products()->where('featured', true)->orderBy('id')->get();
    }

    /** @return Collection<int, Product> */
    public function topRated(int $limit): Collection
    {
        return $this->products()->orderByDesc('rating')->orderBy('id')->limit($limit)->get();
    }

    /**
     * Same subcategory first, then the rest of the category.
     *
     * @return Collection<int, Product>
     */
    public function related(Product $product, int $limit = 4): Collection
    {
        return $this->products()
            ->inCategory($product->subcategory->category)
            ->whereKeyNot($product->id)
            ->orderByRaw('subcategory_id = ? desc', [$product->subcategory_id])
            ->orderBy('id')
            ->limit($limit)
            ->get();
    }

    /**
     * Every word in the query must appear in the name, brand, type, descriptions or tags.
     *
     * @return Collection<int, Product>
     */
    public function search(string $query): Collection
    {
        $terms = preg_split('/\s+/', mb_strtolower(trim($query)), -1, PREG_SPLIT_NO_EMPTY);
        if (! $terms) {
            return new Collection;
        }

        $search = $this->products()->join('subcategories', 'subcategories.id', '=', 'products.subcategory_id')
            ->select('products.*');
        foreach ($terms as $term) {
            $like = '%'.addcslashes($term, '%_\\').'%';
            $search->where(fn (Builder $q) => $q
                ->whereAny(['products.name', 'brand', 'subcategories.slug', 'short_description', 'description'], 'ilike', $like)
                ->orWhereRaw('products.tags::text ilike ?', [$like]));
        }

        return $search->orderByDesc('rating')->get();
    }

    /**
     * @param  iterable<Product>  $products
     * @return list<array<string, mixed>>
     */
    public static function productData(iterable $products): array
    {
        return array_values(ProductResource::collection(collect($products))->resolve());
    }

    /**
     * @param  iterable<Category>  $categories
     * @return list<array<string, mixed>>
     */
    public static function categoryData(iterable $categories): array
    {
        return array_values(CategoryResource::collection(collect($categories))->resolve());
    }
}
