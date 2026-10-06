<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

// Saved gear lists and trip checklists (ported from the old Supabase migration).
// Ownership rules live in App\Policies; these constraints back them up.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gear_lists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 80);
            $table->boolean('is_favorites')->default(false);
            $table->timestamps();

            $table->index('user_id');
        });

        Schema::create('gear_list_items', function (Blueprint $table) {
            $table->foreignUuid('gear_list_id')->constrained()->cascadeOnDelete();
            $table->string('product_id');
            $table->foreign('product_id')->references('id')->on('products')->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->primary(['gear_list_id', 'product_id']);
        });

        Schema::create('trips', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name', 80);
            $table->string('template_id')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });

        Schema::create('trip_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('trip_id')->constrained()->cascadeOnDelete();
            $table->string('label', 120);
            $table->string('section');
            $table->string('product_slug')->nullable();
            $table->string('gear_category')->nullable();
            $table->string('gear_subcategory')->nullable();
            $table->boolean('checked')->default(false);
            $table->integer('position')->default(0);
            $table->timestamps();

            $table->index(['trip_id', 'position']);
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('alter table gear_lists add constraint gear_lists_name_length check (char_length(name) between 1 and 80)');
            DB::statement('alter table trips add constraint trips_name_length check (char_length(name) between 1 and 80)');
            DB::statement('alter table trip_items add constraint trip_items_label_length check (char_length(label) between 1 and 120)');
        }
        // Exactly one Favorites list per user.
        DB::statement('create unique index gear_lists_one_favorites on gear_lists (user_id) where is_favorites');
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_items');
        Schema::dropIfExists('trips');
        Schema::dropIfExists('gear_list_items');
        Schema::dropIfExists('gear_lists');
    }
};
