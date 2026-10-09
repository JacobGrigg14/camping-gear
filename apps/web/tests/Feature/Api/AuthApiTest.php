<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;

test('the app can sign up and gets a token', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'email' => 'app@example.com', 'password' => 'a-good-password', 'device_name' => 'iPhone',
    ])->assertCreated()->assertJsonPath('user.email', 'app@example.com')->assertJsonPath('user.signInMethod', 'email');

    $this->withToken($response->json('token'))->getJson('/api/v1/lists')
        ->assertOk()->assertJsonCount(1)->assertJsonPath('0.isFavorites', true);
});

test('sign-up errors come back per field', function () {
    $this->postJson('/api/v1/auth/register', ['email' => 'nope', 'password' => 'x'])
        ->assertUnprocessable()->assertJsonValidationErrors(['email', 'password']);
});

test('the app can sign in with email and password', function () {
    $user = User::factory()->create();

    $token = $this->postJson('/api/v1/auth/login', ['email' => strtoupper($user->email), 'password' => 'password'])
        ->assertOk()->json('token');

    $this->withToken($token)->getJson('/api/v1/me')->assertOk()->assertJsonPath('user.id', $user->id);
});

test('wrong passwords and password-less (Apple / Google) accounts are rejected', function () {
    $user = User::factory()->create();
    $social = User::factory()->create(['password' => null]);

    $this->postJson('/api/v1/auth/login', ['email' => $user->email, 'password' => 'wrong'])
        ->assertUnprocessable()->assertJsonValidationErrors('email');
    $this->postJson('/api/v1/auth/login', ['email' => $social->email, 'password' => ''])
        ->assertUnprocessable();
});

test('signed-in routes need a token', function () {
    $this->getJson('/api/v1/me')->assertUnauthorized();
    $this->getJson('/api/v1/lists')->assertUnauthorized();
});

test('signing out revokes only this device\'s token', function () {
    $user = User::factory()->create();
    $phone = $user->createToken('phone')->plainTextToken;
    $tablet = $user->createToken('tablet')->plainTextToken;

    $this->withToken($phone)->postJson('/api/v1/auth/logout')->assertNoContent();

    expect($user->tokens()->pluck('name')->all())->toBe(['tablet']);
    $this->app['auth']->forgetGuards();
    $this->withToken($tablet)->getJson('/api/v1/me')->assertOk();
});

test('forgot password sends the website reset link without revealing whether the account exists', function () {
    Notification::fake();
    $user = User::factory()->create();

    $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email])->assertOk();
    $this->postJson('/api/v1/auth/forgot-password', ['email' => 'nobody@example.com'])->assertOk();

    Notification::assertSentTo($user, ResetPassword::class);
    Notification::assertCount(1);
});

test('a one-time code from Apple / Google sign-in swaps for a token exactly once', function () {
    $user = User::factory()->create();
    Cache::put('app-login:abc', $user->id, 300);

    $this->postJson('/api/v1/auth/exchange', ['code' => 'abc'])->assertOk()->assertJsonPath('user.id', $user->id);
    $this->postJson('/api/v1/auth/exchange', ['code' => 'abc'])->assertUnprocessable();
});

test('deleting the account from the app removes everything', function () {
    $user = User::factory()->create();
    $token = $user->createToken('phone')->plainTextToken;

    $this->withToken($token)->deleteJson('/api/v1/me')->assertNoContent();

    expect(User::count())->toBe(0);
    $this->assertDatabaseCount('personal_access_tokens', 0);
    $this->assertDatabaseCount('gear_lists', 0);
});
