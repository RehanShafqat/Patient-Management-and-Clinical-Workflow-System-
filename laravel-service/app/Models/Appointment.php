<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Appointment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'appointment_number',
        'case_id',
        'patient_id',
        'doctor_id',
        'appointment_date',
        'appointment_time',
        'end_time',
        'appointment_type',
        'specialty_id',
        'practice_location_id',
        'duration_minutes',
        'status',
        'reminder_sent',
        'reminder_method',
        'notes',
        'reason_for_visit',
        'created_by',
    ];

    protected $casts = [
        'appointment_date' => 'date',
        'appointment_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'reminder_sent' => 'boolean',
    ];

    // Boot Method
    
    protected static function boot()
    {
        parent::boot();

        // When creating new appointment
        static::creating(function ($appointment) {

            // Generate unique appointment number
            $appointment->appointment_number =
                'APT-' . date('Ymd') . '-' . strtoupper(uniqid());

            // Set end time
            $appointment->setEndTime();
        });

        // When updating appointment
        static::updating(function ($appointment) {
            $appointment->setEndTime();
        });
    }

    // Relationships

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function case()
    {
        return $this->belongsTo(PatientCase::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function specialty()
    {
        return $this->belongsTo(Specialities::class);
    }

    public function practiceLocation()
    {
        return $this->belongsTo(PracticeLocation::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Helper Methods
    
    public function setEndTime()
    {
        if ($this->appointment_time && $this->duration_minutes) {
            $start = Carbon::parse($this->appointment_time);
            $this->end_time = $start->addMinutes($this->duration_minutes);
        }
    }

}