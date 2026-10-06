<?php

use App\Models\ChecklistTemplate;
use App\Models\GearList;
use App\Models\Trip;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(fn () => seedCatalog());

test('account pages need a sign-in', function (string $url) {
    $this->get($url)->assertRedirect('/login');
})->with(['/account', '/my-gear', '/trips']);

test('My Gear lists the signed-in user\'s lists with Favorites first', function () {
    $user = User::factory()->create();
    $user->gearLists()->create(['name' => 'Winter kit'])->setProduct('ss-001', true);

    $this->actingAs($user)->get('/my-gear')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('my-gear/index')
        ->where('lists.0.name', 'Favorites')
        ->where('lists.1.name', 'Winter kit')
        ->where('lists.1.productIds', ['ss-001'])
        ->has('products', 1));
});

test('every page shares the user\'s lists so hearts show saved gear', function () {
    $user = User::factory()->create();
    $user->favorites->setProduct('ss-001', true);

    $this->actingAs($user)->get('/')->assertInertia(fn (Assert $page) => $page
        ->where('auth.user.email', $user->email)
        ->where('lists.0.productIds', ['ss-001']));
    auth()->logout();
    $this->get('/')->assertInertia(fn (Assert $page) => $page->where('auth.user', null)->where('lists', []));
});

test('a list page shows its products, newest first', function () {
    $user = User::factory()->create();
    $list = $user->gearLists()->create(['name' => 'Kit']);
    $list->setProduct('ss-001', true);
    $this->travel(1)->minute();
    $list->setProduct('ss-002', true);

    $this->actingAs($user)->get("/my-gear/{$list->id}")->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('my-gear/show')
        ->where('list.productIds', ['ss-002', 'ss-001'])
        ->where('products.0.id', 'ss-002'));
});

test('other people\'s lists and trips are 404s', function () {
    $owner = User::factory()->create();
    $list = $owner->gearLists()->create(['name' => 'Private']);
    $trip = Trip::createFor($owner, 'Private trip');

    $this->actingAs(User::factory()->create());
    $this->get("/my-gear/{$list->id}")->assertNotFound();
    $this->get("/trips/{$trip->id}")->assertNotFound();
    $this->get('/my-gear/not-a-uuid')->assertNotFound();
});

test('trip page links recommended products', function () {
    $user = User::factory()->create();
    $trip = Trip::createFor($user, 'Weekend', ChecklistTemplate::find('car-camping'));

    $this->actingAs($user)->get("/trips/{$trip->id}")->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('trips/show')
        ->where('trip.name', 'Weekend')
        ->where('productPaths.timberwolf-6p-cabin-tent', '/gear/shelter-sleep/timberwolf-6p-cabin-tent'));
});

test('account page and password change', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/account')->assertInertia(fn (Assert $page) => $page
        ->component('account')
        ->where('signInMethod', 'email')
        ->where('hasPassword', true));

    $this->put('/account/password', ['current_password' => 'wrong', 'password' => 'another-password'])
        ->assertSessionHasErrors('current_password');
    $this->put('/account/password', ['current_password' => 'password', 'password' => 'another-password'])
        ->assertSessionHasNoErrors();
    expect(Hash::check('another-password', $user->fresh()->password))->toBeTrue();
});

test('Apple / Google accounts can set a password without a current one', function () {
    $user = User::factory()->create(['password' => null]);
    $user->socialAccounts()->create(['provider' => 'google', 'provider_id' => '123']);

    $this->actingAs($user)->get('/account')->assertInertia(fn (Assert $page) => $page
        ->where('signInMethod', 'google')
        ->where('hasPassword', false));
    $this->put('/account/password', ['password' => 'first-password'])->assertSessionHasNoErrors();
});

test('deleting the account removes it with its lists and trips', function () {
    $user = User::factory()->create();
    Trip::createFor($user, 'Trip', ChecklistTemplate::first());

    $this->actingAs($user)->delete('/account')->assertRedirect('/');

    $this->assertGuest();
    expect(User::count())->toBe(0)
        ->and(GearList::count())->toBe(0)
        ->and(Trip::count())->toBe(0);
});
