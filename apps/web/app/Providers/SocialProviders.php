<?php

namespace App\Providers;

/** Which Apple / Google sign-in buttons to show: only providers with keys in .env. */
class SocialProviders
{
    /** @return list<string> */
    public static function enabled(): array
    {
        return array_values(array_filter(
            ['apple', 'google'],
            fn (string $provider) => filled(config("services.{$provider}.client_id")),
        ));
    }
}
