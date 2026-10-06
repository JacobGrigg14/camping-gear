<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Fortify\CreateNewUser;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

/** Token sign-in for the app. Each device gets its own Sanctum token. */
class AuthController extends Controller
{
    public function register(Request $request, CreateNewUser $creator): JsonResponse
    {
        $user = $creator->create($request->only('name', 'email', 'password'));

        return $this->tokenResponse($user, $request, 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);

        $user = User::where('email', strtolower($request->string('email')))->first();
        if (! $user || ! $user->password || ! Hash::check($request->string('password'), $user->password)) {
            throw ValidationException::withMessages(['email' => __('auth.failed')]);
        }

        return $this->tokenResponse($user, $request);
    }

    /** Emails a reset link; the link opens the website, where the new password is chosen. */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);
        Password::sendResetLink(['email' => strtolower($request->string('email'))]);

        // Same answer whether or not the account exists.
        return response()->json(['message' => 'If an account exists for that email, a reset link is on its way.']);
    }

    /** Swaps the one-time code from an Apple / Google sign-in (see SocialLoginController) for a token. */
    public function exchange(Request $request): JsonResponse
    {
        $request->validate(['code' => ['required', 'string']]);

        $userId = Cache::pull('app-login:'.$request->string('code'));
        $user = is_int($userId) ? User::find($userId) : null;
        if (! $user) {
            throw ValidationException::withMessages(['code' => "Sign-in didn't complete. Please try again."]);
        }

        return $this->tokenResponse($user, $request);
    }

    public function logout(Request $request): Response
    {
        // Revokes the app's token. (The website signs out with POST /logout instead.)
        PersonalAccessToken::findToken((string) $request->bearerToken())?->delete();

        return response()->noContent();
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userData($request->user())]);
    }

    /** Permanently deletes the account with its lists, trips and tokens (required by the App Store). */
    public function destroy(Request $request): Response
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->noContent();
    }

    private function tokenResponse(User $user, Request $request, int $status = 200): JsonResponse
    {
        $device = substr((string) ($request->input('device_name') ?: $request->userAgent() ?: 'app'), 0, 100);

        return response()->json([
            'token' => $user->createToken($device)->plainTextToken,
            'user' => $this->userData($user),
        ], $status);
    }

    /** @return array{id: int, name: string, email: string, signInMethod: string} */
    private function userData(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'signInMethod' => $user->signInMethod(),
        ];
    }
}
