<?php

namespace App\Http\Controllers;

use App\Concerns\PasswordValidationRules;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    use PasswordValidationRules;

    public function show(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('account', [
            'email' => $user->email,
            'signInMethod' => $user->signInMethod(),
            'hasPassword' => $user->password !== null,
            'status' => $request->session()->get('status'),
        ]);
    }

    /** Change the password (or set one, for accounts created with Apple / Google). */
    public function updatePassword(Request $request): RedirectResponse
    {
        $user = $request->user();
        $request->validate([
            'current_password' => $user->password ? $this->currentPasswordRules() : [],
            'password' => $this->passwordRules(),
        ]);
        $user->update(['password' => $request->string('password')]);

        return back()->with('status', 'Your password has been updated.');
    }

    /** Permanently deletes the account with its lists and trips. */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        Auth::guard('web')->logout();
        $user->tokens()->delete();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
