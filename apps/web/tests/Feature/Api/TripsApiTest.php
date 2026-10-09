<?php

use App\Models\ChecklistTemplate;
use App\Models\Trip;
use App\Models\TripItem;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    seedCatalog();
    $this->user = User::factory()->create();
    Sanctum::actingAs($this->user);
});

test('a trip from a template copies its checklist in order', function () {
    $trip = $this->postJson('/api/v1/trips', ['name' => 'Algonquin', 'templateId' => 'car-camping'])
        ->assertCreated()
        ->assertJsonPath('name', 'Algonquin')
        ->assertJsonPath('templateId', 'car-camping')
        ->assertJsonPath('items.0.label', 'Family tent')
        ->assertJsonPath('items.0.section', 'Shelter & sleep')
        ->assertJsonPath('items.0.productSlug', 'timberwolf-6p-cabin-tent')
        ->assertJsonPath('items.0.gear', null)
        ->assertJsonPath('items.1.gear', ['category' => 'shelter-sleep', 'subcategory' => 'sleeping-bags'])
        ->assertJsonPath('items.0.checked', false)
        ->json();

    $template = ChecklistTemplate::find('car-camping');
    expect($trip['items'])->toHaveCount(collect($template->sections)->sum(fn ($s) => count($s['items'])));
});

test('a trip from scratch starts empty', function () {
    $this->postJson('/api/v1/trips', ['name' => 'Scratch'])->assertCreated()
        ->assertJsonPath('templateId', null)
        ->assertJsonPath('items', []);
    $this->postJson('/api/v1/trips', ['name' => 'X', 'templateId' => 'nope'])->assertJsonValidationErrors('templateId');
});

test('trips come back newest first', function () {
    Trip::createFor($this->user, 'Older');
    $this->travel(1)->minute();
    Trip::createFor($this->user, 'Newer');

    $this->getJson('/api/v1/trips')->assertOk()->assertJsonPath('*.name', ['Newer', 'Older']);
});

test('check items, add custom ones at the end, remove them, delete the trip', function () {
    $trip = Trip::createFor($this->user, 'Trip', ChecklistTemplate::find('car-camping'));
    $first = $trip->items->first();

    $this->patchJson("/api/v1/trip-items/{$first->id}", ['checked' => true])->assertOk()->assertJsonPath('checked', true);

    $custom = $this->postJson("/api/v1/trips/{$trip->id}/items", ['label' => 'Marshmallows'])
        ->assertCreated()->assertJsonPath('section', 'My items')->json();
    $this->getJson("/api/v1/trips/{$trip->id}")->assertJsonPath('items.0.checked', true)
        ->assertJsonPath('items.'.$trip->items->count().'.label', 'Marshmallows');

    $this->deleteJson("/api/v1/trip-items/{$custom['id']}")->assertNoContent();
    $this->deleteJson("/api/v1/trips/{$trip->id}")->assertNoContent();
    expect(Trip::count())->toBe(0);
    $this->assertDatabaseCount('trip_items', 0);
});

test('items copied from the template can be removed, and the removal undone', function () {
    $trip = Trip::createFor($this->user, 'Trip', ChecklistTemplate::find('car-camping'));
    $preset = $trip->items->first();
    $this->patchJson("/api/v1/trip-items/{$preset->id}", ['checked' => true])->assertOk();

    $this->deleteJson("/api/v1/trip-items/{$preset->id}")->assertNoContent();
    $this->getJson("/api/v1/trips/{$trip->id}")->assertJsonCount($trip->items->count() - 1, 'items')
        ->assertJsonMissing(['id' => $preset->id]);

    // Comes back where it was, still checked.
    $this->postJson("/api/v1/trip-items/{$preset->id}/restore")->assertOk()
        ->assertJsonPath('id', $preset->id)->assertJsonPath('checked', true);
    $this->getJson("/api/v1/trips/{$trip->id}")->assertJsonCount($trip->items->count(), 'items')
        ->assertJsonPath('items.0.id', $preset->id)
        ->assertJsonPath('items.0.section', $preset->section);
});

test('removed items are pruned after a day', function () {
    $trip = Trip::createFor($this->user, 'Trip', ChecklistTemplate::find('car-camping'));
    [$older, $recent] = $trip->items;
    $older->delete();
    $this->travel(25)->hours();
    $recent->delete();

    $this->artisan('model:prune', ['--model' => [TripItem::class]])->assertSuccessful();

    expect(TripItem::withTrashed()->find($older->id))->toBeNull()
        ->and(TripItem::withTrashed()->find($recent->id))->not->toBeNull();
});

test('people can\'t see or change someone else\'s trips', function () {
    $other = Trip::createFor(User::factory()->create(), 'Theirs', ChecklistTemplate::first());
    $item = $other->items->first();

    $this->getJson("/api/v1/trips/{$other->id}")->assertNotFound();
    $this->deleteJson("/api/v1/trips/{$other->id}")->assertNotFound();
    $this->postJson("/api/v1/trips/{$other->id}/items", ['label' => 'x'])->assertNotFound();
    $this->patchJson("/api/v1/trip-items/{$item->id}", ['checked' => true])->assertNotFound();
    $this->deleteJson("/api/v1/trip-items/{$item->id}")->assertNotFound();
    $item->delete();
    $this->postJson("/api/v1/trip-items/{$item->id}/restore")->assertNotFound();
    expect($item->fresh()->trashed())->toBeTrue();
    $this->getJson('/api/v1/trips/not-a-uuid')->assertNotFound();
});
