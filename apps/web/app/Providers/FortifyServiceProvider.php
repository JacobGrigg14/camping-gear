<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);

        $this->configureViews();

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }

    private function configureViews(): void
    {
        Fortify::loginView(function (Request $request) {
            $this->rememberNext($request);

            return Inertia::render('auth/login', [
                'status' => $request->session()->get('status'),
                'error' => $request->session()->get('error'),
                'socialProviders' => SocialProviders::enabled(),
            ]);
        });

        Fortify::registerView(function (Request $request) {
            $this->rememberNext($request);

            return Inertia::render('auth/register', ['socialProviders' => SocialProviders::enabled()]);
        });

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));
    }

    /**
     * `/login?next=/gear/...` returns the visitor to that page after signing in or signing up.
     * Only same-site paths are accepted.
     */
    private function rememberNext(Request $request): void
    {
        $next = (string) $request->query('next', '');
        if (str_starts_with($next, '/') && ! str_starts_with($next, '//')) {
            $request->session()->put('url.intended', $next);
        }
    }
}
