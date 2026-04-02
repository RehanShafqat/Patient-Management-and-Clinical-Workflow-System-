<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DoctorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'specialities_id',
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

    public function specialities() {
        return $this->belongsTo(Specialities::class);
    }

    public function practiceLocation() {
        return $this->belongsTo(PracticeLocation::class);
    }
}
