<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diagnoses extends Model
{
    protected $fillable = [
        'icd_code',
        'diagnoses_name',
        'description',
        'is_active',
    ];

    // One diagnoses is used in many visits
    public function visits()
    {
        return $this->hasMany(Visit::class);
    }
}
