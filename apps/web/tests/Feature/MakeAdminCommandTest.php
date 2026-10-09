<?php

use App\Models\User;

test('app:make-admin gives an existing account admin access', function () {
    $user = User::factory()->create(['email' => 'owner@example.com']);

    $this->artisan('app:make-admin', ['email' => 'owner@example.com'])->assertSuccessful();
    expect($user->fresh()->is_admin)->toBeTrue();

    $this->artisan('app:make-admin', ['email' => 'nobody@example.com'])->assertFailed();
});
