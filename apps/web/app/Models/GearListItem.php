<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $gear_list_id
 * @property string $product_id
 */
#[Fillable(['product_id'])]
class GearListItem extends Model
{
    public $incrementing = false;

    protected $primaryKey = null;

    const UPDATED_AT = null;
}
