<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TripItemResource;
use App\Http\Resources\TripResource;
use App\Models\ChecklistTemplate;
use App\Models\Trip;
use App\Models\TripItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class TripController extends Controller
{
    /** The signed-in user's trips, newest first. */
    public function index(Request $request): AnonymousResourceCollection
    {
        return TripResource::collection(
            $request->user()->trips()->with('items')->latest()->get(),
        );
    }

    /** Creates a trip, copying the template's checklist if one is given. */
    public function store(Request $request): TripResource
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'templateId' => ['nullable', 'string', 'exists:checklist_templates,id'],
        ]);
        $template = ChecklistTemplate::where('id', $data['templateId'] ?? null)->first();

        $trip = DB::transaction(fn () => Trip::createFor($request->user(), trim($data['name']), $template));

        return new TripResource($trip);
    }

    public function show(Trip $trip): TripResource
    {
        Gate::authorize('view', $trip);

        return new TripResource($trip->load('items'));
    }

    public function destroy(Trip $trip): Response
    {
        Gate::authorize('delete', $trip);
        $trip->delete();

        return response()->noContent();
    }

    /** Adds a custom item at the end of the checklist. */
    public function addItem(Request $request, Trip $trip): TripItemResource
    {
        Gate::authorize('update', $trip);
        $data = $request->validate(['label' => ['required', 'string', 'max:120']]);

        return new TripItemResource($trip->addCustomItem(trim($data['label'])));
    }

    public function updateItem(Request $request, TripItem $item): TripItemResource
    {
        Gate::authorize('update', $item->trip);
        $item->update($request->validate(['checked' => ['required', 'boolean']]));

        return new TripItemResource($item);
    }

    public function removeItem(TripItem $item): Response
    {
        Gate::authorize('update', $item->trip);
        $item->delete();

        return response()->noContent();
    }

    /** Undoes a removal: the item comes back in its original section and position. */
    public function restoreItem(TripItem $item): TripItemResource
    {
        Gate::authorize('update', $item->trip);
        $item->restore();

        return new TripItemResource($item);
    }
}
