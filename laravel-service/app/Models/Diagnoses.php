<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diagnosis extends Model
{
    protected $fillable = [
        'icd_code',
        'diagnosis_name',
        'description',
        'is_active',
    ];

    // One diagnosis is used in many visits
    public function visits()
    {
        return $this->hasMany(Visit::class);
    }
}
