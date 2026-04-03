<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DoctorProfile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'specialty_id',
        'practice_location_id',
        'license_number',
        'availability_schedule',
        'bio',
    ];

    // Add relationship
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function specialty() {
        return $this->belongsTo(Specialty::class);
    }

    public function practiceLocation() {
        return $this->belongsTo(PracticeLocation::class);
    }
}
