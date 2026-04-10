<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = [
        'permission_name',

    ];

    // One permission type is assigned to many FDO users
    public function userPermissions()
    {
        return $this->hasMany(UserPermission::class);
    }
}
