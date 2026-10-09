<?php

namespace App\Policies;

use App\Models\Trip;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/** People can only see and change their own trips and their items (someone else's trip is a 404). */
class TripPolicy
{
    public function view(User $user, Trip $trip): Response
    {
        return $trip->user_id === $user->id ? Response::allow() : Response::denyAsNotFound();
    }

    public function update(User $user, Trip $trip): Response
    {
        return $this->view($user, $trip);
    }

    public function delete(User $user, Trip $trip): Response
    {
        return $this->view($user, $trip);
    }
}
