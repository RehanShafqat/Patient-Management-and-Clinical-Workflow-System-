<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'date_of_birth',
        'gender',
        'ssn',
        'email',
        'phone',
        'mobile',
        'address',
        'city',
        'state',
        'zip_code',
        'country',
        'emergency_contact_name',
        'emergency_contact_phone', 
        'primary_physician',
        'insurance_provider',
        'insurance_policy_number',
        'preferred_language',
        'patient_status',
        'registration_date',
        'deleted_at',
    ];

    public function cases(){
        return $this->hasMany(Cases::class);
    }
}
