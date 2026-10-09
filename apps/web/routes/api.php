<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CatalogController;
use App\Http\Controllers\Api\V1\GearListController;
use App\Http\Controllers\Api\V1\TripController;
use Illuminate\Support\Facades\Route;

// JSON API for the Expo app. The website also calls the signed-in routes, using its session
// cookie (Sanctum stateful requests); the app sends a bearer token.

Route::prefix('v1')->group(function () {
    Route::middleware('throttle:120,1')->group(function () {
        Route::get('catalog', [CatalogController::class, 'index']);
        Route::get('products/{slug}', [CatalogController::class, 'product']);
        Route::get('search', [CatalogController::class, 'search']);
    });

    Route::middleware('throttle:10,1')->group(function () {
        Route::post('auth/register', [AuthController::class, 'register']);
        Route::post('auth/login', [AuthController::class, 'login']);
        Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('auth/exchange', [AuthController::class, 'exchange']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::delete('me', [AuthController::class, 'destroy']);

        Route::get('lists', [GearListController::class, 'index']);
        Route::post('lists', [GearListController::class, 'store']);
        Route::patch('lists/{list}', [GearListController::class, 'update'])->whereUuid('list');
        Route::delete('lists/{list}', [GearListController::class, 'destroy'])->whereUuid('list');
        Route::put('lists/{list}/products/{productId}', [GearListController::class, 'addProduct'])->whereUuid('list');
        Route::delete('lists/{list}/products/{productId}', [GearListController::class, 'removeProduct'])->whereUuid('list');

        Route::get('trips', [TripController::class, 'index']);
        Route::post('trips', [TripController::class, 'store']);
        Route::get('trips/{trip}', [TripController::class, 'show'])->whereUuid('trip');
        Route::delete('trips/{trip}', [TripController::class, 'destroy'])->whereUuid('trip');
        Route::post('trips/{trip}/items', [TripController::class, 'addItem'])->whereUuid('trip');
        Route::patch('trip-items/{item}', [TripController::class, 'updateItem'])->whereUuid('item');
        Route::delete('trip-items/{item}', [TripController::class, 'removeItem'])->whereUuid('item');
        Route::post('trip-items/{item}/restore', [TripController::class, 'restoreItem'])->whereUuid('item')->withTrashed();
    });
});
