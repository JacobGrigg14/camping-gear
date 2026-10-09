<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Permanently deletes removed trip items once they can no longer be undone.
Schedule::command('model:prune')->daily();

// Gives an existing account access to /admin (sign up on the site first).
Artisan::command('app:make-admin {email}', function (string $email) {
    $user = User::where('email', $email)->first();
    if (! $user) {
        $this->error("No account with the email {$email}. Sign up on the site first.");

        return 1;
    }
    $user->forceFill(['is_admin' => true])->save();
    $this->info("{$email} can now sign in at /admin.");
})->purpose('Give an account access to the admin panel');
