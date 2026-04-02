<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PatientCase extends Model
{
    use SoftDeletes;

    protected $table = 'cases';

    protected $fillable = [
        'case_number',
        'patient_id',
        'practice_location_id',
        'category',
        'purpose_of_visit',
        'case_type',
        'priority',
        'case_status',
        'date_of_accident',
        'insurance_id',
        'firm_id',
        'referred_by',
        'referred_doctor_name',
        'opening_date',
        'closing_date',
        'clinical_notes',
    ];

    protected $casts = [
        'date_of_accident' => 'date',
        'opening_date' => 'date',
        'closing_date' => 'date',
    ];

//   Boot Method

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($case) {
            $case->case_number =
                'CASE-' . date('Y') . '-' . strtoupper(uniqid());
        });
    }

//    Relationships

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'case_id');
    }

    public function visits()
    {
        return $this->hasMany(Visit::class, 'case_id');
    }

    public function practiceLocation()
    {
        return $this->belongsTo(PracticeLocation::class);
    }

    public function insurance()
    {
        return $this->belongsTo(Insurance::class);
    }

    public function firm()
    {
        return $this->belongsTo(Firm::class);
    }
}