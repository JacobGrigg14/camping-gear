<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Removed checklist items are kept for a day so they can be restored (undo). */
    public function up(): void
    {
        Schema::table('trip_items', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('trip_items', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
