<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\Catalog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function __construct(private Catalog $catalog) {}

    public function home(): Response
    {
        return Inertia::render('home', [
            'categories' => Catalog::categoryData($this->catalog->categories()),
            'featured' => Catalog::productData($this->catalog->featured()),
            'topRated' => Catalog::productData($this->catalog->topRated(6)),
        ]);
    }

    public function category(Category $category): Response
    {
        return Inertia::render('category', [
            'category' => Catalog::categoryData([$category->load('subcategories')])[0],
            'products' => Catalog::productData($this->catalog->inCategory($category)),
        ]);
    }

    public function product(Category $category, string $slug): Response
    {
        $product = $this->catalog->product($slug);
        abort_unless($product && $product->subcategory->category_id === $category->id, 404);

        return Inertia::render('product', [
            'product' => Catalog::productData([$product])[0],
            'category' => ['slug' => $category->slug, 'name' => $category->name],
            'subcategoryName' => $product->subcategory->name,
            'related' => Catalog::productData($this->catalog->related($product, 3)),
        ]);
    }

    /** Searches as you type in the browser, so the page gets the whole (small) catalog. */
    public function search(Request $request): Response
    {
        return Inertia::render('search', [
            'products' => Catalog::productData($this->catalog->products()->orderBy('id')->get()),
            'query' => (string) $request->query('q', ''),
        ]);
    }
}
