<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

test('sign-in and sign-up pages render', function (string $url) {
    $this->get($url)->assertOk();
})->with(['/login', '/register', '/forgot-password']);

test('people can sign in and land on My Gear', function () {
    $user = User::factory()->create();

    $this->post('/login', ['email' => $user->email, 'password' => 'password'])->assertRedirect('/my-gear');
    $this->assertAuthenticatedAs($user);
});

test('signing in from a product page returns there', function () {
    $user = User::factory()->create();

    $this->get('/login?next=/gear/shelter-sleep/some-tent')->assertOk();
    $this->post('/login', ['email' => $user->email, 'password' => 'password'])
        ->assertRedirect('/gear/shelter-sleep/some-tent');
});

test('next only accepts same-site paths', function () {
    $user = User::factory()->create();

    $this->get('/login?next=//evil.example.com')->assertOk();
    $this->post('/login', ['email' => $user->email, 'password' => 'password'])->assertRedirect('/my-gear');
});

test('wrong password is rejected', function () {
    $user = User::factory()->create();

    $this->post('/login', ['email' => $user->email, 'password' => 'wrong'])->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('sign-up needs only an email and password, and creates a Favorites list', function () {
    $this->post('/register', ['email' => 'Camper@Example.com', 'password' => 'a-good-password'])
        ->assertRedirect('/my-gear');

    $user = User::sole();
    expect($user->email)->toBe('camper@example.com')
        ->and($user->name)->toBe('camper')
        ->and($user->gearLists()->pluck('name')->all())->toBe(['Favorites'])
        ->and($user->favorites->is_favorites)->toBeTrue();
    $this->assertAuthenticatedAs($user);
});

test('sign-up rejects taken emails and short passwords', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $this->post('/register', ['email' => 'taken@example.com', 'password' => 'short'])
        ->assertSessionHasErrors(['email', 'password']);
});

test('password reset emails a link and the link sets a new password', function () {
    Notification::fake();
    $user = User::factory()->create();

    $this->post('/forgot-password', ['email' => $user->email])->assertSessionHas('status');

    Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use ($user) {
        $this->get("/reset-password/{$notification->token}?email={$user->email}")->assertOk();
        $this->post('/reset-password', [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'brand-new-password',
        ])->assertSessionHasNoErrors();

        return true;
    });

    $this->post('/login', ['email' => $user->email, 'password' => 'brand-new-password']);
    $this->assertAuthenticatedAs($user);
});

test('people can sign out', function () {
    $this->actingAs(User::factory()->create())->post('/logout')->assertRedirect('/');
    $this->assertGuest();
});
