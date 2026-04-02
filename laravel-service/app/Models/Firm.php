<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Firm extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'firm_name',
        'firm_type',
        'address',
        'phone',
        'contact_person',
        'is_active',
    ];

    public function cases()
    {
        return $this->hasMany(PatientCase::class);
    }
}