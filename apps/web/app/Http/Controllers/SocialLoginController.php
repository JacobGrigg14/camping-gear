<?php

namespace App\Http\Controllers;

use App\Models\SocialAccount;
use App\Models\User;
use App\Providers\SocialProviders;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\Provider;
use Laravel\Socialite\Contracts\User as SocialUser;
use Laravel\Socialite\Facades\Socialite;
use SocialiteProviders\Apple\Provider as AppleProvider;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Apple / Google sign-in for the website and the app.
 *
 * Website: /auth/{provider}/redirect?next=/my-gear → provider → callback signs in and returns to `next`.
 * App: /auth/{provider}/redirect?app_redirect=basecamp://auth/callback → provider → callback sends the
 * browser back to the app with a one-time `code`, which the app swaps for a token (POST /api/v1/auth/exchange).
 */
class SocialLoginController extends Controller
{
    public const array PROVIDERS = ['apple', 'google'];

    /** Survives Apple's cross-site POST callback, which doesn't carry the session cookie. */
    private const string INTENT_COOKIE = 'social_login';

    /** Deep links the app may ask to be sent back to (Expo Go uses exp://). */
    private const array APP_SCHEMES = ['basecamp://', 'exp://', 'exps://'];

    public function redirect(Request $request, string $provider): Response
    {
        $appRedirect = (string) $request->query('app_redirect', '');
        $next = (string) $request->query('next', '');

        if ($appRedirect !== '' && ! Str::startsWith($appRedirect, self::APP_SCHEMES)) {
            abort(400, 'Invalid app redirect.');
        }
        if (! in_array($provider, SocialProviders::enabled(), true)) {
            return $this->fail($appRedirect, ucfirst($provider)." sign-in isn't set up yet.");
        }

        $intent = [
            'app_redirect' => $appRedirect ?: null,
            'next' => str_starts_with($next, '/') && ! str_starts_with($next, '//') ? $next : null,
        ];

        $response = $this->driver($provider)->redirect();
        $response->headers->setCookie(cookie(
            self::INTENT_COOKIE, json_encode($intent, JSON_THROW_ON_ERROR), minutes: 10, secure: true, sameSite: 'none',
        ));

        return $response;
    }

    public function callback(Request $request, string $provider): RedirectResponse
    {
        $cookie = $request->cookie(self::INTENT_COOKIE);
        $intent = is_string($cookie) ? (json_decode($cookie, true) ?: []) : [];
        $appRedirect = $intent['app_redirect'] ?? null;

        try {
            $socialUser = $this->driver($provider)->user();
        } catch (Throwable $e) {
            report($e);

            return $this->fail($appRedirect, "Sign-in didn't complete. Please try again.");
        }

        $user = $this->findOrCreateUser($provider, $socialUser);
        $forget = cookie()->forget(self::INTENT_COOKIE);

        if ($appRedirect) {
            $code = Str::random(48);
            Cache::put("app-login:{$code}", $user->id, now()->addMinutes(5));

            return redirect()->away($this->withQuery($appRedirect, ['code' => $code]))->withCookie($forget);
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->intended($intent['next'] ?? config('fortify.home'))->withCookie($forget);
    }

    private function driver(string $provider): Provider
    {
        $driver = Socialite::driver($provider);

        // Apple posts the callback cross-site, so the session isn't available there.
        return $driver instanceof AppleProvider ? $driver->stateless()->cookieNonce() : $driver;
    }

    /** Signs in the linked account, else links to an existing user with that email, else creates one. */
    private function findOrCreateUser(string $provider, SocialUser $socialUser): User
    {
        return DB::transaction(function () use ($provider, $socialUser) {
            $account = SocialAccount::with('user')
                ->where(['provider' => $provider, 'provider_id' => $socialUser->getId()])
                ->first();
            if ($account) {
                return $account->user;
            }

            $email = Str::lower((string) $socialUser->getEmail());
            $user = User::where('email', $email)->first() ?? User::forceCreate([
                'name' => $socialUser->getName() ?: Str::before($email, '@'),
                'email' => $email,
                'email_verified_at' => now(),
            ]);
            $user->socialAccounts()->create(['provider' => $provider, 'provider_id' => $socialUser->getId()]);

            return $user;
        });
    }

    private function fail(?string $appRedirect, string $message): RedirectResponse
    {
        return $appRedirect
            ? redirect()->away($this->withQuery($appRedirect, ['error_description' => $message]))
            : redirect()->route('login')->with('error', $message);
    }

    /** @param array<string, string> $query */
    private function withQuery(string $url, array $query): string
    {
        return $url.(str_contains($url, '?') ? '&' : '?').http_build_query($query);
    }
}
