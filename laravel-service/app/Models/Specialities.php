<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Specialty extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'specialty_name',
        'description',
        'is_active',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}