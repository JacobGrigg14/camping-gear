<?php

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

beforeEach(function () {
    config(['services.google.client_id' => 'test-client', 'services.google.client_secret' => 'secret']);
});

function fakeGoogleUser(string $id = 'g-123', string $email = 'camper@gmail.com'): void
{
    $user = (new SocialiteUser)->map(['id' => $id, 'name' => 'Happy Camper', 'email' => $email]);
    $provider = Mockery::mock(Provider::class);
    $provider->shouldReceive('user')->andReturn($user);
    Socialite::shouldReceive('driver')->with('google')->andReturn($provider);
}

test('buttons only show for providers with keys', function () {
    $this->get('/login')->assertInertia(fn ($page) => $page->where('socialProviders', ['google']));
});

test('a provider without keys sends people back to sign in', function () {
    $this->get('/auth/apple/redirect')->assertRedirect('/login')->assertSessionHas('error');
});

test('first Google sign-in creates the account with Favorites and signs in', function () {
    fakeGoogleUser();

    $this->get('/auth/google/callback')->assertRedirect('/my-gear');

    $user = User::sole();
    expect($user->email)->toBe('camper@gmail.com')
        ->and($user->password)->toBeNull()
        ->and($user->signInMethod())->toBe('google')
        ->and($user->favorites)->not->toBeNull();
    $this->assertAuthenticatedAs($user);
});

test('Google sign-in links to an existing account with the same email', function () {
    $existing = User::factory()->create(['email' => 'camper@gmail.com']);
    fakeGoogleUser();

    $this->get('/auth/google/callback');

    $this->assertAuthenticatedAs($existing);
    expect($existing->socialAccounts()->count())->toBe(1);
});

test('the app gets a one-time code on its deep link instead of a session', function () {
    fakeGoogleUser();

    $response = $this->withCookie('social_login', json_encode(['app_redirect' => 'basecamp://auth/callback', 'next' => null]))
        ->get('/auth/google/callback');

    $location = $response->headers->get('Location');
    expect($location)->toStartWith('basecamp://auth/callback?code=');
    parse_str(parse_url($location, PHP_URL_QUERY), $query);
    expect(Cache::get("app-login:{$query['code']}"))->toBe(User::sole()->id);
    $this->assertGuest();
});

test('app redirects must be the app\'s own deep link', function () {
    $this->get('/auth/google/redirect?app_redirect=https://evil.example.com')->assertStatus(400);
});
