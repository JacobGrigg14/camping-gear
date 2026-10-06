<?php

namespace App\Http\Controllers;

use App\Http\Resources\ChecklistTemplateResource;
use App\Http\Resources\TripResource;
use App\Models\ChecklistTemplate;
use App\Models\Trip;
use App\Services\Catalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

/** Trip checklists. Changes go through the JSON API (see routes/api.php). */
class TripController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('trips/index', [
            'trips' => TripResource::collection($request->user()->trips()->with('items')->latest()->get())->resolve(),
            'templates' => ChecklistTemplateResource::collection(ChecklistTemplate::orderBy('position')->get())->resolve(),
        ]);
    }

    public function show(Trip $trip, Catalog $catalog): Response
    {
        Gate::authorize('view', $trip);
        $trip->load('items');
        $slugs = $trip->items->pluck('product_slug')->filter()->unique();

        return Inertia::render('trips/show', [
            'trip' => (new TripResource($trip))->resolve(),
            // Recommended products in the checklist, keyed by slug, for "Our pick" links.
            'productPaths' => $catalog->products()->whereIn('slug', $slugs)->get()
                ->mapWithKeys(fn ($p) => [$p->slug => $p->path()]),
        ]);
    }
}
