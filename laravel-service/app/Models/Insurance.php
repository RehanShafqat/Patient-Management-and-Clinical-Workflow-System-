<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Insurance extends Model
{
    use SoftDeletes;

    protected $table = 'insurance';

    protected $fillable = [
        'insurance_name',
        'insurance_code',
        'is_active',
    ];

    public function addresses()
    {
        return $this->hasMany(InsuranceAddress::class);
    }

    public function cases()
    {
        return $this->hasMany(PatientCase::class);
    }

    public function primaryAddress()
    {
        return $this->hasOne(InsuranceAddress::class)->where('is_primary', true);
    }
}