<?php

use App\Models\GearList;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    seedCatalog();
    $this->user = User::factory()->create();
    Sanctum::actingAs($this->user);
});

test('lists come back Favorites first, then oldest to newest', function () {
    $this->user->gearLists()->create(['name' => 'B']);
    $this->travel(1)->minute();
    $this->user->gearLists()->create(['name' => 'C']);

    $this->getJson('/api/v1/lists')->assertOk()
        ->assertJsonPath('*.name', ['Favorites', 'B', 'C'])
        ->assertJsonStructure([['id', 'name', 'isFavorites', 'productIds', 'createdAt']]);
});

test('create a list with a first product, rename it and delete it', function () {
    $list = $this->postJson('/api/v1/lists', ['name' => '  Winter kit ', 'productId' => 'ss-001'])
        ->assertCreated()
        ->assertJsonPath('name', 'Winter kit')
        ->assertJsonPath('productIds', ['ss-001'])
        ->json();

    $this->patchJson("/api/v1/lists/{$list['id']}", ['name' => 'Winter backpacking'])
        ->assertOk()->assertJsonPath('name', 'Winter backpacking');

    $this->deleteJson("/api/v1/lists/{$list['id']}")->assertNoContent();
    expect(GearList::find($list['id']))->toBeNull();
});

test('list names are required and at most 80 characters', function () {
    $this->postJson('/api/v1/lists', ['name' => ''])->assertJsonValidationErrors('name');
    $this->postJson('/api/v1/lists', ['name' => str_repeat('a', 81)])->assertJsonValidationErrors('name');
    $this->postJson('/api/v1/lists', ['name' => 'ok', 'productId' => 'nope'])->assertJsonValidationErrors('productId');
});

test('saving and unsaving products is idempotent', function () {
    $favorites = $this->user->favorites;

    $this->putJson("/api/v1/lists/{$favorites->id}/products/ss-001")->assertNoContent();
    $this->putJson("/api/v1/lists/{$favorites->id}/products/ss-001")->assertNoContent();
    expect($favorites->fresh()->productIds()->all())->toBe(['ss-001']);

    $this->deleteJson("/api/v1/lists/{$favorites->id}/products/ss-001")->assertNoContent();
    $this->deleteJson("/api/v1/lists/{$favorites->id}/products/ss-001")->assertNoContent();
    expect($favorites->fresh()->productIds()->all())->toBe([]);

    $this->putJson("/api/v1/lists/{$favorites->id}/products/not-a-product")->assertNotFound();
});

test('Favorites can be renamed but not deleted', function () {
    $favorites = $this->user->favorites;

    $this->patchJson("/api/v1/lists/{$favorites->id}", ['name' => 'Wishlist'])->assertOk();
    $this->deleteJson("/api/v1/lists/{$favorites->id}")->assertForbidden();
    expect($favorites->fresh())->not->toBeNull();
});

test('people can\'t see or change someone else\'s lists', function () {
    $other = User::factory()->create()->favorites;

    $this->patchJson("/api/v1/lists/{$other->id}", ['name' => 'Mine now'])->assertNotFound();
    $this->deleteJson("/api/v1/lists/{$other->id}")->assertNotFound();
    $this->putJson("/api/v1/lists/{$other->id}/products/ss-001")->assertNotFound();
    $this->getJson('/api/v1/lists')->assertJsonCount(1);
});

test('the website calls the API with its session cookie', function () {
    // A signed-in browser on the same site, no token (Sanctum stateful request).
    $this->app['auth']->forgetGuards();
    $this->actingAs($this->user, 'web')
        ->withHeader('Referer', config('app.url'))
        ->getJson('/api/v1/lists')
        ->assertOk()->assertJsonCount(1);
});
