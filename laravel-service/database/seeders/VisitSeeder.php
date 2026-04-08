<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Visit;
use App\Models\Appointment;
use App\Models\Diagnoses;

class VisitSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Appointment::all() as $appointment) {
            Visit::create([
                'visit_number' => 'VIS-' . rand(10000, 99999),
                'appointment_id' => $appointment->id,
                'case_id' => $appointment->case_id,
                'patient_id' => $appointment->patient_id,
                'doctor_id' => $appointment->doctor_id,
                'visit_date' => now(),
                'diagnoses_id' => Diagnoses::inRandomOrder()->first()->id,
                'treatment' => 'General treatment',
                'visit_status' => 'Completed',
            ]);
        }
    }
}