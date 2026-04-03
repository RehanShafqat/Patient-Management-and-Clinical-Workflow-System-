<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPermission extends Model
{
    protected $fillable = [
        'user_id',
        'permission_id',
        'is_granted',
    ];

    // Belongs to the FDO user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Belongs to the permission type
    public function permission()
    {
        return $this->belongsTo(Permission::class);
    }
}
