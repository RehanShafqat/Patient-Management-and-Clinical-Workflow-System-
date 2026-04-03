<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PracticeLocation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'location_name',
        'address',
        'city',
        'state',
        'zip',
        'phone',
        'email',
        'is_active',
    ];

    public function cases()
    {
        return $this->hasMany(PatientCase::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function doctorProfiles() {
        return $this->hasMany(DoctorProfile::class);
    }
}