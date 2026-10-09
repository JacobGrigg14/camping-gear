<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ChecklistTemplate;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use UnexpectedValueException;

/**
 * Loads the starter catalog from database/seeders/data/*.json (exported from the old TS data files).
 * Safe to re-run: rows are matched by slug / id and updated in place.
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $subcategoryIds = $this->seedCategories();
            $this->seedProducts($subcategoryIds);
            $this->seedChecklistTemplates();
        });
    }

    /** @return array<string, int> "category/subcategory" => subcategory id */
    private function seedCategories(): array
    {
        $ids = [];
        foreach ($this->load('categories') as $position => $data) {
            $category = Category::updateOrCreate(['slug' => $data['slug']], [
                'name' => $data['name'],
                'tagline' => $data['tagline'],
                'description' => $data['description'],
                'image' => $data['image'],
                'position' => $position,
            ]);
            foreach ($data['subcategories'] as $subPosition => $sub) {
                $subcategory = $category->subcategories()->updateOrCreate(
                    ['slug' => $sub['slug']],
                    ['name' => $sub['name'], 'position' => $subPosition],
                );
                $ids["{$category->slug}/{$subcategory->slug}"] = $subcategory->id;
            }
        }

        return $ids;
    }

    /** @param array<string, int> $subcategoryIds */
    private function seedProducts(array $subcategoryIds): void
    {
        foreach ($this->load('products') as $data) {
            $product = Product::updateOrCreate(['id' => $data['id']], [
                'slug' => $data['slug'],
                'name' => $data['name'],
                'brand' => $data['brand'],
                'subcategory_id' => $subcategoryIds["{$data['category']}/{$data['subcategory']}"],
                'short_description' => $data['shortDescription'],
                'description' => $data['description'],
                'images' => $data['images'],
                'price_tier' => $data['priceTier'],
                'rating' => $data['rating'],
                'specs' => $data['specs'],
                'pros' => $data['pros'],
                'cons' => $data['cons'],
                'tags' => $data['tags'],
                'featured' => $data['featured'] ?? false,
            ]);
            foreach ($data['links'] as $position => $link) {
                $product->links()->updateOrCreate(
                    ['retailer' => $link['retailer']],
                    ['url' => $link['url'] ?: null, 'position' => $position],
                );
            }
        }
    }

    private function seedChecklistTemplates(): void
    {
        foreach ($this->load('checklist-templates') as $position => $data) {
            ChecklistTemplate::updateOrCreate(['id' => $data['id']], [
                'name' => $data['name'],
                'description' => $data['description'],
                'sections' => $data['sections'],
                'position' => $position,
            ]);
        }
    }

    /** @return list<array<string, mixed>> */
    private function load(string $name): array
    {
        $data = File::json(__DIR__."/data/{$name}.json", JSON_THROW_ON_ERROR);
        if (! array_is_list($data)) {
            throw new UnexpectedValueException("database/seeders/data/{$name}.json must be a JSON array.");
        }

        return $data;
    }
}
