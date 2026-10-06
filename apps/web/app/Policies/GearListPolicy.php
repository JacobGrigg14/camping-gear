<?php

namespace App\Policies;

use App\Models\GearList;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * People can only see and change their own lists (someone else's list is a 404).
 * Favorites can be renamed but never deleted.
 */
class GearListPolicy
{
    public function view(User $user, GearList $list): Response
    {
        return $list->user_id === $user->id ? Response::allow() : Response::denyAsNotFound();
    }

    public function update(User $user, GearList $list): Response
    {
        return $this->view($user, $list);
    }

    public function delete(User $user, GearList $list): Response
    {
        if ($list->user_id !== $user->id) {
            return Response::denyAsNotFound();
        }

        return $list->is_favorites ? Response::deny("Favorites can't be deleted.") : Response::allow();
    }
}
