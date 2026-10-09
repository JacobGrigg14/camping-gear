<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(CatalogSeeder::class);

        if (app()->isLocal()) {
            // Local admin for /admin. Password: "password".
            $admin = User::firstOrCreate(
                ['email' => 'admin@example.com'],
                ['name' => 'Admin', 'password' => 'password'],
            );
            $admin->forceFill(['is_admin' => true])->save();
        }
    }
}
