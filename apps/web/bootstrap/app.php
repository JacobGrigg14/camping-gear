<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // The website calls the JSON API with its session cookie, like any first-party SPA.
        $middleware->statefulApi();

        // Apple posts its sign-in callback from appleid.apple.com (checked by the nonce instead).
        $middleware->preventRequestForgery(except: ['auth/apple/callback']);

        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Site-styled error pages. 404s always; server errors only when debug output is off.
        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            $status = $response->getStatusCode();
            $show = $status === 404 || $status === 403 || ($status >= 500 && ! config('app.debug'));
            if (! $show || $request->is('api/*', 'admin', 'admin/*') || $request->expectsJson()) {
                return $response;
            }

            return Inertia::render('error', [...HandleInertiaRequests::siteProps($request), 'status' => $status])
                ->toResponse($request)
                ->setStatusCode($status);
        });
    })->create();
