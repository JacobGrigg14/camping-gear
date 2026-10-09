<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Retailers are now Amazon, MEC, Bass Pro Shops and REI. Cabela's links become Bass Pro Shops
     * (same company), products sold at REI or Backcountry gain an MEC link, and the Cabela's and
     * Backcountry links are removed. Existing Amazon, Bass Pro and REI URLs are kept.
     */
    public function up(): void
    {
        DB::transaction(function () {
            $order = ['amazon', 'mec', 'bass-pro', 'rei'];

            DB::table('product_links')->get()->groupBy('product_id')->each(function ($links, $productId) use ($order) {
                $has = $links->pluck('retailer')->flip();
                $wanted = array_filter([
                    'amazon' => $has->has('amazon'),
                    'mec' => $has->has('rei') || $has->has('backcountry'),
                    'bass-pro' => $has->has('bass-pro') || $has->has('cabelas'),
                    'rei' => $has->has('rei'),
                ]);

                foreach (array_keys($wanted) as $retailer) {
                    DB::table('product_links')->updateOrInsert(
                        ['product_id' => $productId, 'retailer' => $retailer],
                        ['position' => array_search($retailer, $order), 'updated_at' => now()],
                    );
                }
                DB::table('product_links')
                    ->where('product_id', $productId)
                    ->whereNotIn('retailer', array_keys($wanted))
                    ->delete();
            });

            DB::table('product_links')->whereNull('created_at')->update(['created_at' => now()]);
        });
    }

    public function down(): void
    {
        // The removed retailers' links were empty placeholders; nothing to restore.
    }
};
