<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('tagline');
            $table->text('description');
            $table->string('image');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });

        Schema::create('subcategories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('slug');
            $table->string('name');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->unique(['category_id', 'slug']);
        });

        // Products keep their original string ids (e.g. "ss-001"): saved lists reference them.
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('brand');
            $table->foreignId('subcategory_id')->constrained()->restrictOnDelete();
            $table->string('short_description');
            $table->text('description');
            $table->jsonb('images');
            $table->string('price_tier', 4);
            $table->decimal('rating', 2, 1);
            $table->jsonb('specs');
            $table->jsonb('pros');
            $table->jsonb('cons');
            $table->jsonb('tags');
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });

        Schema::create('product_links', function (Blueprint $table) {
            $table->id();
            $table->string('product_id');
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('retailer');
            // Empty until the real affiliate link is available; the buy button shows "coming soon".
            $table->text('url')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->unique(['product_id', 'retailer']);
        });

        Schema::create('checklist_templates', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('description');
            // [{ title, items: [{ label, productSlug?, gear?: { category, subcategory } }] }]
            $table->jsonb('sections');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('checklist_templates');
        Schema::dropIfExists('product_links');
        Schema::dropIfExists('products');
        Schema::dropIfExists('subcategories');
        Schema::dropIfExists('categories');
    }
};
